import React, { useState, useEffect } from "react";
import api from "../api/axios";

const EmployeeForm = ({ onSuccess, editingEmployee }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    department: "",
    position: "",
  });

  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    api.get("/departments?pagination[pageSize]=100").then((res) =>
      setDepartments(res.data.data)
    );
    api.get("/positions?pagination[pageSize]=100").then((res) =>
      setPositions(res.data.data)
    );
  }, []);

  useEffect(() => {
    if (editingEmployee) {
      setForm({
        name: editingEmployee.attributes.name,
        email: editingEmployee.attributes.email,
        department: editingEmployee.attributes.department.data?.id || "",
        position: editingEmployee.attributes.position.data?.id || "",
      });
    }
  }, [editingEmployee]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      data: {
        name: form.name,
        email: form.email,
        department: form.department,
        position: form.position,
      },
    };

    if (editingEmployee) {
      await api.put(`/employees/${editingEmployee.id}`, payload);
    } else {
      await api.post("/employees", payload);
    }

    setForm({ name: "", email: "", department: "", position: "" });
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{editingEmployee ? "Edit" : "Add"} Employee</h2>
      <input
        type="text"
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        required
      />
      <select
        value={form.department}
        onChange={(e) => setForm({ ...form, department: e.target.value })}
        required
      >
        <option value="">Select Department</option>
        {departments.map((d) => (
          <option key={d.id} value={d.id}>
            {d.attributes.name}
          </option>
        ))}
      </select>
      <select
        value={form.position}
        onChange={(e) => setForm({ ...form, position: e.target.value })}
        required
      >
        <option value="">Select Position</option>
        {positions.map((p) => (
          <option key={p.id} value={p.id}>
            {p.attributes.name}
          </option>
        ))}
      </select>
      <button type="submit">{editingEmployee ? "Update" : "Add"}</button>
    </form>
  );
};

export default EmployeeForm;
