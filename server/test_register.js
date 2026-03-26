const axios = require('axios');

async function testRegister() {
  try {
    const response = await axios.post('http://localhost:3000/api/auth/register', {
      name: 'Test Node',
      email: `test_node_${Date.now()}@example.com`,
      phone: `${Date.now()}`.slice(-10),
      password: 'password123'
    });
    console.log('Success:', response.status, response.data);
  } catch (error) {
    console.error('Error:', error.response ? error.response.status : error.message, error.response ? error.response.data : '');
  }
}

testRegister();
