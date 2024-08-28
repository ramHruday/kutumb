import { useContext, useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import Select from "react-select";
import { MongoContext } from "../context/mongo-context";

function FilterPanel(props) {
  const { filters, setFilters } = useContext(MongoContext);
  const onChangeFilters = (key, value) => {
    let copy = new Map(filters);
    copy.set(
      key,
      value.map((v) => v.value)
    );
    setFilters(copy);
  };
  return (
    <Row className="py-1">
      <Col xs={12} className="mb-3">
        <FilterBox
          isMulti
          filterKey="artist_name"
          label="Artists"
          onChange={(v) => onChangeFilters("artist_name", v)}
        />
      </Col>
      <Col xs={12} className="mb-3">
        <FilterBox
          isMulti
          filterKey="category"
          label="Art Category"
          onChange={(v) => onChangeFilters("category", v)}
        />
      </Col>
      <Col xs={12} className="mb-3">
        <FilterBox
          isMulti
          filterKey="auction_name"
          label="Auction"
          onChange={(v) => onChangeFilters("auction_name", v)}
        />
      </Col>
      <Col xs={12} className="mb-3">
        <FilterBox
          isMulti
          filterKey="auction_house"
          label="Auction House"
          onChange={(v) => onChangeFilters("auction_house", v)}
        />
      </Col>
      <Col xs={12} className="mb-3">
        <FilterBox
          isMulti
          filterKey="auction_date"
          label="Auction Date"
          onChange={(v) => onChangeFilters("auction_date", v)}
          isDate
        />
      </Col>
    </Row>
  );
}

export default FilterPanel;

function FilterBox(props) {
  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState(props.fallBack ?? []);

  const { user } = useContext(MongoContext);

  useEffect(() => {
    setLoading(true);
    if (!props.fallBack && user) {
      user?.functions
        ?.getSaffronArtFilters(props.filterKey, props.isDate)
        .then((resp) => {
          if (props.isDate) {
            setOptions(
              resp.result
                .map((v) => ({
                  value: v._id,
                  label: new Date(v._id),
                }))
                .sort((a, b) => a.label.getTime() - b.label.getTime())
                .map((x) => ({
                  ...x,
                  label: x.label.toDateString(),
                }))
            );
          } else {
            setOptions(
              resp.result
                .map((v) => ({ value: v._id, label: v._id }))
                .filter((x) => !!x.value)
                .sort((a, b) => a.label.localeCompare(b.label))
            );
          }
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <>
      <span className="text-white">{props.label}</span>
      <Select
        isMulti
        name={props.filterKey}
        title={props.filterKey}
        options={options}
        onChange={props.onChange}
        isLoading={loading}
        menuPlacement="top"
      />
    </>
  );
}
