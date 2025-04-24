import React from 'react';

const About = () => {
  return (
    <div style={{
      padding: '40px',
      maxWidth: '900px',
      margin: '0 auto',
      lineHeight: '1.6',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f5f5f5',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h1 style={{ 
        fontSize: '32px', 
        marginBottom: '30px',
        color: '#2c3e50',
        textAlign: 'center',
        borderBottom: '2px solid #3498db',
        paddingBottom: '10px'
      }}>About Our Employee Management System</h1>

      <p style={{
        fontSize: '18px',
        color: '#34495e',
        textAlign: 'center',
        marginBottom: '30px'
      }}>
        Welcome to our <strong>Employee Management System</strong> - a modern, full-stack application 
        powered by React on the frontend and Strapi on the backend. This system is designed to 
        streamline your HR operations and make employee management a breeze!
      </p>

      <div style={{
        backgroundColor: 'white',
        padding: '25px',
        borderRadius: '8px',
        marginBottom: '30px'
      }}>
        <h2 style={{ 
          fontSize: '24px', 
          color: '#2c3e50',
          marginBottom: '20px'
        }}>Key Features:</h2>
        
        <ul style={{ 
          listStyle: 'none',
          padding: '0'
        }}>
          <li style={{
            margin: '15px 0',
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
            color: '#34495e'
          }}>
            <span style={{ 
              color: '#27ae60',
              marginRight: '10px',
              fontSize: '20px'
            }}>✔️</span>
            Complete Employee Management (Add, Edit, Delete)
          </li>
          <li style={{
            margin: '15px 0',
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
            color: '#34495e'
          }}>
            <span style={{ 
              color: '#27ae60',
              marginRight: '10px',
              fontSize: '20px'
            }}>✔️</span>
            Export Functionality (CSV & PDF formats)
          </li>
          <li style={{
            margin: '15px 0',
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
            color: '#34495e'
          }}>
            <span style={{ 
              color: '#27ae60',
              marginRight: '10px',
              fontSize: '20px'
            }}>✔️</span>
            Automated Email Notifications for New Employees
          </li>
          <li style={{
            margin: '15px 0',
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
            color: '#34495e'
          }}>
            <span style={{ 
              color: '#27ae60',
              marginRight: '10px',
              fontSize: '20px'
            }}>✔️</span>
            Real-time Dashboard Analytics
          </li>
        </ul>
      </div>

      <div style={{
        textAlign: 'center',
        padding: '20px',
        backgroundColor: '#3498db',
        color: 'white',
        borderRadius: '8px'
      }}>
        <p style={{ margin: 0 }}>
          Developed with ❤️ by <strong>Rakesh Saunr</strong><br/>
          Full Stack Development Internship Project
        </p>
      </div>
    </div>
  );
};

export default About;
