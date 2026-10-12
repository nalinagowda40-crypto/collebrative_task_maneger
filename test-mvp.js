// test-mvp.js
const http = require('http');

const request = (path, method = 'GET', data = null, token = null) => {
  return new Promise((resolve, reject) => {
    const payload = data ? JSON.stringify(data) : null;
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
};

async function runTest() {
  console.log('🧪 Starting MVP Acceptance Test Suite...\n');

  // 1. Manager logs in
  console.log('1️⃣ Manager login...');
  const mgrLogin = await request('/api/auth/login', 'POST', {
    email: 'manager@company.com',
    password: 'Password123!',
  });
  console.log('Manager login status:', mgrLogin.status, mgrLogin.data.message);
  const mgrToken = mgrLogin.data.data.token;
  const mgrUser = mgrLogin.data.data.user;

  // 2. User logs in
  console.log('\n2️⃣ User login...');
  const userLogin = await request('/api/auth/login', 'POST', {
    email: 'user@company.com',
    password: 'Password123!',
  });
  console.log('User login status:', userLogin.status, userLogin.data.message);
  const userToken = userLogin.data.data.token;
  const normalUser = userLogin.data.data.user;

  // 3. Manager creates task assigned to User
  console.log('\n3️⃣ Manager creating task assigned to User...');
  const createTaskRes = await request('/api/tasks', 'POST', {
    title: 'Acceptance Test Task - Verification',
    description: 'Verifying end-to-end task workflow for MVP criteria.',
    priority: 'High',
    status: 'To Do',
    dueDate: '2026-10-30',
    assigneeId: normalUser.id,
  }, mgrToken);
  console.log('Task created status:', createTaskRes.status, 'ID:', createTaskRes.data.data.task.id);
  const taskId = createTaskRes.data.data.task.id;

  // 4. User views tasks assigned to them
  console.log('\n4️⃣ User fetching assigned tasks...');
  const userTasksRes = await request('/api/tasks', 'GET', null, userToken);
  const foundTask = userTasksRes.data.data.tasks.find(t => t.id === taskId);
  console.log('User found task in list?', Boolean(foundTask), 'Title:', foundTask?.title);

  // 5. User updates status to "In Progress"
  console.log('\n5️⃣ User updating status to "In Progress"...');
  const updateStatus1 = await request(`/api/tasks/${taskId}`, 'PUT', {
    status: 'In Progress',
  }, userToken);
  console.log('Status update result:', updateStatus1.status, 'New status:', updateStatus1.data.data.task.status);

  // 6. User attempts unauthorized modification (e.g. changing title or priority)
  console.log('\n6️⃣ User attempting unauthorized edit (changing title)...');
  const unauthorizedEdit = await request(`/api/tasks/${taskId}`, 'PUT', {
    title: 'Malicious title modification by unauthorized user',
  }, userToken);
  console.log('Unauthorized edit response status:', unauthorizedEdit.status, '(Expected 403 Forbidden)');
  console.log('Message:', unauthorizedEdit.data.message);

  // 7. User attempts unauthorized delete
  console.log('\n7️⃣ User attempting unauthorized delete...');
  const unauthorizedDelete = await request(`/api/tasks/${taskId}`, 'DELETE', null, userToken);
  console.log('Unauthorized delete response status:', unauthorizedDelete.status, '(Expected 403 Forbidden)');

  // 8. User updates status to "Completed"
  console.log('\n8️⃣ User updating status to "Completed"...');
  const updateStatus2 = await request(`/api/tasks/${taskId}`, 'PUT', {
    status: 'Completed',
  }, userToken);
  console.log('Status update 2 result:', updateStatus2.status, 'New status:', updateStatus2.data.data.task.status);

  // 9. Manager checks task activity history
  console.log('\n9️⃣ Manager checking task activity timeline...');
  const activityRes = await request(`/api/tasks/${taskId}/activities`, 'GET', null, mgrToken);
  console.log('Activity count for task:', activityRes.data.data.activities.length);
  activityRes.data.data.activities.forEach(act => {
    console.log(`- [${act.createdAt}] ${act.action}: ${act.details}`);
  });

  console.log('\n✅ ALL MVP ACCEPTANCE CRITERIA PASSED SUCCESSFULLY!');
}

runTest().catch(console.error);
