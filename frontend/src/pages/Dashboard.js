import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { useNavigate } from 'react-router-dom';
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import './Dashboard.css';

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [employee, setEmployee] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    hireDate: '',
    position: '',
    department: '',
    status: 'Active',
    profilePicture: null
  });
  // eslint-disable-next-line no-unused-vars
  const [departments, setDepartments] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [positions, setPositions] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch positions data when component mounts
    const fetchPositions = async () => {
      try {
        // Replace this with your actual API endpoint
        const response = await fetch('/api/positions');
        const data = await response.json();
        setPositions(data);
      } catch (error) {
        console.error('Error fetching positions:', error);
        // Set some default positions if API fails
        setPositions([
          { id: 1, title: 'Software Engineer' },
          { id: 2, title: 'Project Manager' },
          { id: 3, title: 'UI/UX Designer' },
          { id: 4, title: 'Product Manager' },
          { id: 5, title: 'QA Engineer' }
        ]);
      }
    };

    // Fetch departments data when component mounts
    const fetchDepartments = async () => {
      try {
        // Replace this with your actual API endpoint
        const response = await fetch('/api/departments');
        const data = await response.json();
        setDepartments(data);
      } catch (error) {
        console.error('Error fetching departments:', error);
        // Set some default departments if API fails
        setDepartments([
          { id: 1, name: 'Engineering' },
          { id: 2, name: 'Product' },
          { id: 3, name: 'Design' },
          { id: 4, name: 'Marketing' },
          { id: 5, name: 'Sales' },
          { id: 6, name: 'HR' },
          { id: 7, name: 'Finance' },
          { id: 8, name: 'Operations' }
        ]);
      }
    };

    fetchPositions();
    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    setEmployee({ ...employee, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setEmployee({ ...employee, profilePicture: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { firstName, lastName, email, position, department } = employee;
    if (!firstName || !lastName || !email || !position || !department) {
      alert('Please fill in all required fields!');
      return;
    }

    if (isEditing) {
      const updated = employees.map((emp) =>
        emp.id === editId ? { ...emp, ...employee } : emp
      );
      setEmployees(updated);
      alert('Employee updated successfully!');
    } else {
      const newEmployee = {
        id: Date.now(),
        ...employee,
        profilePictureUrl: employee.profilePicture ? URL.createObjectURL(employee.profilePicture) : null
      };
      setEmployees([...employees, newEmployee]);
      alert('Employee added but failed to send welcome email.');
    }

    setEmployee({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      hireDate: '',
      position: '',
      department: '',
      status: 'Active',
      profilePicture: null
    });
    setIsEditing(false);
    setEditId(null);
    setShowModal(false);
  };

  const handleEdit = (emp) => {
    setEmployee({
      firstName: emp.firstName,
      lastName: emp.lastName,
      email: emp.email,
      phone: emp.phone,
      hireDate: emp.hireDate,
      position: emp.position,
      department: emp.department,
      status: emp.status,
      profilePicture: emp.profilePicture
    });
    setIsEditing(true);
    setEditId(emp.id);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this employee?');
    if (!confirmDelete) return;
    setEmployees(employees.filter((emp) => emp.id !== id));
    alert('Employee deleted successfully!');
  };

  const exportToCSV = () => {
    const headers = ['First Name', 'Last Name', 'Email', 'Phone', 'Hire Date', 'Position', 'Department', 'Status'];
    const rows = employees.map(emp => [
      emp.firstName.replace(/,/g, ''),
      emp.lastName.replace(/,/g, ''),
      emp.email.replace(/,/g, ''),
      emp.phone.replace(/,/g, ''),
      emp.hireDate,
      emp.position.replace(/,/g, ''),
      emp.department.replace(/,/g, ''),
      emp.status
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `employees_${new Date().toLocaleDateString()}.csv`;
    link.click();
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Employee List", 14, 22);

    const headers = [["Name", "Email", "Phone", "Position", "Department", "Status"]];
    const data = employees.map(emp => [
      `${emp.firstName} ${emp.lastName}`,
      emp.email,
      emp.phone,
      emp.position,
      emp.department,
      emp.status
    ]);

    autoTable(doc, {
      head: headers,
      body: data,
      startY: 30
    });

    doc.save('employees.pdf');
  };

  const totalEmployees = employees.length;
  const departmentCounts = employees.reduce((acc, emp) => {
    acc[emp.department] = (acc[emp.department] || 0) + 1;
    return acc;
  }, {});
  const positionCounts = employees.reduce((acc, emp) => {
    acc[emp.position] = (acc[emp.position] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="dashboard-container" style={{padding: '20px', maxWidth: '1200px', margin: '0 auto'}}>
      <div className="dashboard-statistics" style={{marginBottom: '30px'}}>
        <h2 className="section-title">📊 Dashboard Statistics</h2>
        <div className="stat-grid" style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px'}}>
          <div className="stat-box" style={{padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
            <h3>👥 Total Employees</h3>
            <p className="highlight">{totalEmployees}</p>
          </div>
          <div className="stat-box" style={{padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
            <h3>🏢 Departments</h3>
            {Object.entries(departmentCounts).map(([dept, count]) => (
              <div key={dept} className="stat-item" style={{display: 'flex', justifyContent: 'space-between'}}>
                <span>{dept}:</span><span>{count}</span>
              </div>
            ))}
          </div>
          <div className="stat-box" style={{padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
            <h3>💼 Positions</h3>
            {Object.entries(positionCounts).map(([pos, count]) => (
              <div key={pos} className="stat-item" style={{display: 'flex', justifyContent: 'space-between'}}>
                <span>{pos}:</span><span>{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="employee-list-section" style={{backgroundColor: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
          <h2 className="section-title">Employee List</h2>
          <button 
            onClick={() => {
              setIsEditing(false);
              setEmployee({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                hireDate: '',
                position: '',
                department: '',
                status: 'Active',
                profilePicture: null
              });
              setShowModal(true);
            }}
            style={{
              padding: '10px 20px',
              backgroundColor: '#28a745',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Add Employee
          </button>
        </div>

        <div className="export-buttons" style={{marginBottom: '20px', display: 'flex', gap: '10px'}}>
          <button onClick={exportToCSV} className="btn-success" style={{padding: '8px 16px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer'}}>Export CSV</button>
          <button onClick={exportToPDF} className="btn-danger" style={{padding: '8px 16px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer'}}>Export PDF</button>
        </div>

        {employees.length === 0 ? (
          <p>No employees found.</p>
        ) : (
          <ul className="employee-list" style={{listStyle: 'none', padding: 0, margin: 0}}>
            {employees.map((emp) => (
              <li key={emp.id} className="employee-card" style={{
                marginBottom: '15px',
                padding: '15px',
                borderRadius: '8px',
                backgroundColor: '#f8f9fa',
                display: 'flex',
                alignItems: 'center',
                gap: '20px'
              }}>
                {emp.profilePictureUrl && (
                  <img src={emp.profilePictureUrl} alt={`${emp.firstName}'s profile`} style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    objectFit: 'cover'
                  }} />
                )}
                <div className="employee-info" style={{flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <div>
                    <strong>{emp.firstName} {emp.lastName}</strong>
                    <br />
                    {emp.position} ({emp.department})
                    <br />
                    📧 {emp.email} | 📱 {emp.phone}
                    <br />
                    Status: {emp.status}
                  </div>
                  <div className="employee-actions" style={{display: 'flex', gap: '10px'}}>
                    <button onClick={() => handleEdit(emp)} style={{padding: '8px 16px', backgroundColor: '#ffc107', border: 'none', borderRadius: '4px', cursor: 'pointer'}}>Edit</button>
                    <button onClick={() => handleDelete(emp.id)} style={{padding: '8px 16px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer'}}>Delete</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#fff',
            padding: '30px',
            borderRadius: '8px',
            width: '90%',
            maxWidth: '800px',
            maxHeight: '90vh',
            overflow: 'auto',
            position: 'relative'
          }}>
            <button 
              onClick={() => setShowModal(false)}
              style={{
                position: 'absolute',
                right: '10px',
                top: '10px',
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                padding: '5px'
              }}
            >
              ✕
            </button>
            <h2 style={{marginBottom: '20px'}}>{isEditing ? 'Edit Employee' : 'Add Employee'}</h2>
            <form onSubmit={handleSubmit} className="employee-form">
              <div className="form-fields" style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px'}}>
                <div className="form-group">
                  <label>First Name: *</label>
                  <input type="text" name="firstName" value={employee.firstName} onChange={handleChange} placeholder="John" required style={{width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd'}} />
                </div>
                <div className="form-group">
                  <label>Last Name: *</label>
                  <input type="text" name="lastName" value={employee.lastName} onChange={handleChange} placeholder="Doe" required style={{width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd'}} />
                </div>
                <div className="form-group">
                  <label>Email: *</label>
                  <input type="email" name="email" value={employee.email} onChange={handleChange} placeholder="johndoe@example.com" required style={{width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd'}} />
                </div>
                <div className="form-group">
                  <label>Phone:</label>
                  <input type="tel" name="phone" value={employee.phone} onChange={handleChange} placeholder="+1234567890" style={{width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd'}} />
                </div>
                <div className="form-group">
                  <label>Hire Date:</label>
                  <input type="date" name="hireDate" value={employee.hireDate} onChange={handleChange} style={{width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd'}} />
                </div>
                <div className="form-group">
                  <label>Position: *</label>
                  <select name="position" value={employee.position} onChange={handleChange} required style={{width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd'}}>
                    <option value="">Select Position</option>
                    {positions.map(pos => (
                      <option key={pos.id} value={pos.title}>{pos.title}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Department: *</label>
                  <select name="department" value={employee.department} onChange={handleChange} required style={{width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd'}}>
                    <option value="">Select Department</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Product">Product</option>
                    <option value="Design">Design</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                    <option value="HR">HR</option>
                    <option value="Finance">Finance</option>
                    <option value="Operations">Operations</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Status:</label>
                  <select name="status" value={employee.status} onChange={handleChange} style={{width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd'}}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div className="form-group" style={{gridColumn: '1 / -1'}}>
                  <label>Profile Picture:</label>
                  <input type="file" name="profilePicture" accept="image/*" onChange={handleFileChange} style={{width: '100%', padding: '8px'}} />
                </div>
                <div style={{gridColumn: '1 / -1', display: 'flex', gap: '10px', justifyContent: 'flex-end'}}>
                  <button type="button" onClick={() => setShowModal(false)} style={{
                    padding: '12px 24px',
                    backgroundColor: '#6c757d',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}>Cancel</button>
                  <button type="submit" style={{
                    padding: '12px 24px',
                    backgroundColor: '#007bff',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}>{isEditing ? 'Update' : 'Add'}</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
