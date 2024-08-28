import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Figure from "react-bootstrap/Figure";
import Row from "react-bootstrap/Row";
import { MongoContext } from "../context/mongo-context";
import ImageMeta from "./image-meta";

const rows = 3;
function ArtItem(props) {
  const { user, isAdmin } = useContext(MongoContext);

  const [hiddenItems, setHiddenItems] = useState(new Set());
  const onDelete = (n) => {
    const copy = new Set(hiddenItems).add(n);
    setHiddenItems(copy);
    user.functions.deleteSimilarImage(props._id, n).then((resp) => {
      console.log(resp);
    });
  };

  return (
    <Row className="shadow p-2 my-2 art-item rounded" data-key={props._id}>
      <Col xs={12} md={4}>
        <Figure className="w-100">
          <ImageMeta sid={props._id} />
        </Figure>
      </Col>
      <Col className="p-1">
        {Array.from(Array(rows).keys()).map((i) => (
          <Row key={i + "similar-image-row"}>
            {[1 + i * 3, 2 + i * 3, 3 + i * 3]
              .filter((x) => !!props[`s${x}`] && !hiddenItems.has(x))
              .map((x) => (
                <Col xs={4} key={x + "similar-image"}>
                  <Figure className="w-100 shadow-sm bg-white p-1">
                    <Figure.Caption
                      title="Percentage Similarity"
                      className="fw-bold d-flex justify-content-between"
                    >
                      <span>
                        {Math.round(props[`percent_similar_s${x}`] * 100)} %
                        Similar
                      </span>
                      {isAdmin ? (
                        <Button
                          onClick={() => onDelete(x)}
                          variant="outline"
                          className="p-0"
                          size="sm"
                        >
                          <FontAwesomeIcon
                            icon={faTrash}
                            size="sm"
                            color="grey"
                          />
                        </Button>
                      ) : null}
                    </Figure.Caption>

                    <ImageMeta sid={props[`s${x}`]} />
                  </Figure>
                </Col>
              ))}
          </Row>
        ))}
      </Col>
    </Row>
  );
}

export default ArtItem;
