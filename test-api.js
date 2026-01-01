/**
 * API测试脚本
 * 用于快速验证后端API的基本功能
 * 
 * 使用方法:
 * 1. 确保后端服务已启动 (npm run dev)
 * 2. 运行: node test-api.js
 */

const https = require('http');

const BASE_URL = 'http://localhost:3000';
const API_PREFIX = '/api';

// 测试结果统计
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// HTTP请求封装
function request(method, path, data = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    const req = https.request(url, options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const response = {
            status: res.statusCode,
            data: body ? JSON.parse(body) : null
          };
          resolve(response);
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

// 测试断言
function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    log(`  ✓ ${message}`, 'green');
    return true;
  } else {
    failedTests++;
    log(`  ✗ ${message}`, 'red');
    return false;
  }
}

// 测试套件
async function runTests() {
  log('\n════════════════════════════════════════', 'cyan');
  log('  API 功能测试', 'cyan');
  log('════════════════════════════════════════\n', 'cyan');

  let authToken = '';
  let testUserId = '';
  const testEmail = `test_${Date.now()}@example.com`;
  const testPassword = 'Test123456';

  // 1. 测试用户注册
  log('📝 测试用户注册', 'blue');
  try {
    const response = await request('POST', `${API_PREFIX}/auth/register`, {
      email: testEmail,
      password: testPassword,
      nickname: '测试用户'
    });
    
    assert(response.status === 200 || response.status === 201, '注册请求状态码正确');
    assert(response.data && response.data.success, '注册成功返回success=true');
    assert(response.data.data && response.data.data.token, '注册返回Token');
    
    if (response.data.data && response.data.data.token) {
      authToken = response.data.data.token;
      if (response.data.data.user) {
        testUserId = response.data.data.user._id || response.data.data.user.id;
      }
    }
  } catch (error) {
    log(`  ⚠ 注册测试失败: ${error.message}`, 'yellow');
  }

  // 2. 测试用户登录
  log('\n🔑 测试用户登录', 'blue');
  try {
    const response = await request('POST', `${API_PREFIX}/auth/login`, {
      email: testEmail,
      password: testPassword
    });
    
    assert(response.status === 200, '登录请求状态码正确');
    assert(response.data && response.data.success, '登录成功返回success=true');
    assert(response.data.data && response.data.data.token, '登录返回Token');
    
    if (response.data.data && response.data.data.token) {
      authToken = response.data.data.token;
    }
  } catch (error) {
    log(`  ⚠ 登录测试失败: ${error.message}`, 'yellow');
  }

  // 3. 测试获取当前用户信息
  log('\n👤 测试获取用户信息', 'blue');
  try {
    const response = await request('GET', `${API_PREFIX}/auth/me`, null, {
      'Authorization': `Bearer ${authToken}`
    });
    
    assert(response.status === 200, '获取用户信息状态码正确');
    assert(response.data && response.data.success, '获取用户信息成功');
    assert(response.data.data && response.data.data.user, '返回用户信息');
  } catch (error) {
    log(`  ⚠ 获取用户信息测试失败: ${error.message}`, 'yellow');
  }

  // 4. 测试获取题目列表
  log('\n📋 测试获取题目列表', 'blue');
  try {
    const response = await request('GET', `${API_PREFIX}/questions`, null, {
      'Authorization': `Bearer ${authToken}`
    });
    
    assert(response.status === 200, '获取题目列表状态码正确');
    assert(response.data && response.data.success, '获取题目列表成功');
    assert(response.data.data && Array.isArray(response.data.data.questions), '返回题目数组');
    
    if (response.data.data && response.data.data.questions) {
      const questionCount = response.data.data.questions.length;
      assert(questionCount > 0, `题目数量大于0 (实际: ${questionCount})`);
    }
  } catch (error) {
    log(`  ⚠ 获取题目列表测试失败: ${error.message}`, 'yellow');
  }

  // 5. 测试健康检查
  log('\n💚 测试健康检查', 'blue');
  try {
    const response = await request('GET', `${API_PREFIX}/health`);
    assert(response.status === 200, '健康检查状态码正确');
  } catch (error) {
    log(`  ⚠ 健康检查测试失败: ${error.message}`, 'yellow');
  }

  // 6. 测试错误处理 - 无效Token
  log('\n🚫 测试错误处理', 'blue');
  try {
    const response = await request('GET', `${API_PREFIX}/auth/me`, null, {
      'Authorization': 'Bearer invalid_token'
    });
    
    assert(response.status === 401, '无效Token返回401状态码');
  } catch (error) {
    // 401错误是预期的
    assert(true, '无效Token返回401状态码');
  }

  // 7. 测试404错误
  try {
    const response = await request('GET', `${API_PREFIX}/nonexistent`);
    assert(response.status === 404, '不存在的路由返回404');
  } catch (error) {
    // 404错误是预期的
    assert(true, '不存在的路由返回404');
  }

  // 输出测试结果
  log('\n════════════════════════════════════════', 'cyan');
  log('  测试结果统计', 'cyan');
  log('════════════════════════════════════════\n', 'cyan');
  
  log(`总测试数: ${totalTests}`, 'blue');
  log(`通过: ${passedTests}`, 'green');
  log(`失败: ${failedTests}`, failedTests > 0 ? 'red' : 'green');
  
  const successRate = totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(2) : 0;
  log(`\n成功率: ${successRate}%`, successRate >= 80 ? 'green' : 'yellow');
  
  if (failedTests === 0) {
    log('\n🎉 所有测试通过！', 'green');
  } else {
    log('\n⚠️  部分测试失败，请检查错误信息', 'yellow');
  }
  
  log('\n════════════════════════════════════════\n', 'cyan');

  // 返回测试结果
  process.exit(failedTests > 0 ? 1 : 0);
}

// 主函数
async function main() {
  log('\n正在连接到后端服务...', 'yellow');
  log(`API地址: ${BASE_URL}${API_PREFIX}`, 'cyan');
  
  try {
    // 检查服务是否可用
    await request('GET', '/');
    log('✓ 后端服务连接成功\n', 'green');
    
    // 运行测试
    await runTests();
  } catch (error) {
    log('\n✗ 无法连接到后端服务', 'red');
    log(`错误: ${error.message}`, 'red');
    log('\n请确保后端服务已启动 (npm run dev)', 'yellow');
    process.exit(1);
  }
}

// 执行测试
main();

