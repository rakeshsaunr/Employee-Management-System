import React, { useState, useEffect } from "react";
import api from "../api/axios";

const EmployeeList = ({ onEdit }) => {
  const [employees, setEmployees] = useState([]);

  const fetchEmployees = async () => {
    const res = await api.get("/employees?populate=department,position");
    setEmployees(res.data.data);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      await api.delete(`/employees/${id}`);
      fetchEmployees();
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <div>
      <h2>Employees</h2>
      <ul>
        {employees.map((emp) => (
          <li key={emp.id}>
            {emp.attributes.name} – {emp.attributes.email} –{" "}
            {emp.attributes.department?.data?.attributes?.name || "No Dept"} –{" "}
            {emp.attributes.position?.data?.attributes?.name || "No Position"}
            <button onClick={() => onEdit(emp)}>Edit</button>
            <button onClick={() => handleDelete(emp.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmployeeList;
