import { useContext, useEffect, useState } from "react";
import { Badge, CloseButton } from "react-bootstrap";
import { MongoContext } from "../context/mongo-context";

function FilterPill(props) {
  const { filters, setFilters, getImageData } = useContext(MongoContext);
  const [art, setArt] = useState({});

  useEffect(() => {
    const a = getImageData(props.value.toString());
    setArt(a);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onRemove = (value) => {
    let copy = new Map(filters);
    let fl = filters.get("_id");
    copy.set(
      props.k,
      fl.filter((v) => v !== value)
    );
    setFilters(copy);
  };

  return (
    <Badge
      className="d-flex justify-content-between"
      style={{ width: "5.5rem" }}
    >
      <span className="text-truncate" style={{ width: "5rem" }}>
        ID : {art?.title ?? props.value.toString()}{" "}
      </span>
      <CloseButton onClick={() => onRemove(props.value)} />
    </Badge>
  );
}

export default FilterPill;
