import React from "react";

function TableHeader({ page, filterStatus, add, deleteDoc }) {
  return (
    <div className="table-header">
      <h1>{`${!page ? "Deals" : page} - ${filterStatus}`}</h1>
      <div className="button-header">
        <button className="button-delete" onClick={() => add()}>
          Add
        </button>
        <button className="button-add" onClick={() => deleteDoc()}>
          Delete
        </button>
      </div>
    </div>
  );
}

export default TableHeader;
