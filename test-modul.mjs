import { $fetch } from 'ofetch';

async function test() {
  try {
    const loginRes = await $fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      body: { email: 'admin@gmail.com', password: 'password' }
    });
    
    const token = loginRes.data.token;
    
    const res = await $fetch('http://localhost:3001/api/modul/monev', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log("Modul response:", JSON.stringify(res.data[0], null, 2));
  } catch (err) {
    console.error(err);
  }
}

test();
