import {
  faCircleHalfStroke,
  faDollarSign,
  faExternalLink,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import { Badge, Image, Spinner } from "react-bootstrap";
import Figure from "react-bootstrap/Figure";
import { MongoContext } from "../context/mongo-context";

function ImageMeta(props) {
  const [loading, setLoading] = useState(false);
  const [art, setArt] = useState({});
  const [dateYear, setDateYear] = useState("");

  const { user, getImageData, addToImageMap, filters, setFilters } =
    useContext(MongoContext);

  const onImageClick = (value) => {
    let copy = new Map(filters);
    copy.set("_id", [value]);
    setFilters(copy);
  };

  // useEffect(() => {
  //   const a = getImageData(props.sid);
  //   if (!a) {
  //     setLoading(true);
  //     user.functions.fetchByID(props.sid).then((resp) => {
  //       if (resp.result) {
  //         addToImageMap(props.sid.toString(), resp.result[0]);
  //         setArt(resp.result[0]);
  //         setDateYear(resp.result[0]?.auction_date?.getFullYear());

  //         setLoading(false);
  //       }
  //     });
  //   } else {
  //     setArt(a);
  //     setLoading(false);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);
  if (loading) {
    return <Spinner variant="border" size="sm"></Spinner>;
  }

  return art ? (
    <>
      <Image
        fluid
        src={art.image_url}
        alt={art.title}
        className="w-100 cursor-pointer"
        onClick={() => onImageClick(art._id)}
      />
      <div className="px-1 pb-1">
        <Figure.Caption title="Art Title">
          {art.title} by <span className="fw-bold">{art.artist_name}</span>
        </Figure.Caption>

        <Figure.Caption
          title={`Auction Name ${art.auction_name} - ${dateYear}`}
          className="font-monospace text-truncate d-none d-md-block"
        >
          {dateYear}, {art.auction_name}
        </Figure.Caption>
        <Figure.Caption className="py-1 d-none d-md-flex">
          <div
            title="Dominant Color"
            className="color-box me-1"
            style={{ backgroundColor: `#${art.dom_color}` }}
          ></div>
          <span className="text-truncate"> {art.size}</span>
        </Figure.Caption>
        <Figure.Caption className="py-1 justify-content-between d-flex">
          <span title="Brightness">
            <FontAwesomeIcon icon={faCircleHalfStroke} className="me-2" />{" "}
            {Math.round(art.brightness * 10) / 10}
          </span>
          <Badge pill bg="success" title="Winning Bid">
            {art.winning_bid > 0 ? (
              <>
                <FontAwesomeIcon icon={faDollarSign} className="me-1" />
                {Math.round(art.winning_bid * 10) / 10}
              </>
            ) : (
              "Not Sold!"
            )}
          </Badge>
        </Figure.Caption>

        <Figure.Caption className="d-flex justify-content-between">
          {art.hi_est > 0 || art.lo_est > 0 ? (
            <Badge pill bg="secondary" title="Estimated Cost Range">
              <FontAwesomeIcon icon={faDollarSign} className="me-1" />
              {art.hi_est > 0
                ? Math.round(art.hi_est * 10) / 10 + " -"
                : null}{" "}
              {art.lo_est > 0 ? Math.round(art.lo_est * 10) / 10 : null}
            </Badge>
          ) : null}
          <a
            href={art.lot_link}
            target="_blank"
            rel="noreferrer"
            className="small"
          >
            Lot ID : {art.lot_id}
            <FontAwesomeIcon icon={faExternalLink} className="mx-1" />
          </a>
        </Figure.Caption>
        {art.provenance ? (
          <Figure.Caption className="d-flex small p-1">
            {art.provenance.replace(/provenance:|/gi, "")}
          </Figure.Caption>
        ) : null}
      </div>
    </>
  ) : null;
}

export default ImageMeta;
