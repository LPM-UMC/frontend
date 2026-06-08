import { $fetch } from 'ofetch';

async function test() {
  try {
    const loginRes = await $fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      body: { email: 'admin@gmail.com', password: 'password' }
    });
    
    const token = loginRes.data.token;
    
    // get pId
    const pmRes = await $fetch('http://localhost:3001/api/periode-modul', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const pId = pmRes.data[0].id;
    console.log("pId:", pId);
    
    const aspekRes = await $fetch(`http://localhost:3001/api/periode-modul/${pId}/aspek`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log("aspekRes:", JSON.stringify(aspekRes, null, 2));
  } catch (err) {
    console.error(err);
  }
}

test();
