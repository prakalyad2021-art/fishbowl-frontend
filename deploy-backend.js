#!/usr/bin/env node

/**
 * Deploy Amplify Gen 2 Backend
 * Run: node deploy-backend.js
 * 
 * Requires AWS credentials to be configured
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';

console.log('🚀 Deploying Amplify Gen 2 Backend...\n');

try {
  // Deploy backend using Amplify CLI
  console.log('📦 Deploying backend resources...');
  const output = execSync('npx @aws-amplify/backend-cli@latest sandbox --once --outputs-format json', {
    encoding: 'utf-8',
    stdio: 'pipe'
  });

  // Try to extract amplify_outputs.json from output
  console.log('✅ Backend deployed successfully!');
  console.log('\n📋 Output:');
  console.log(output);

  // The CLI should have created amplify_outputs.json in the current directory
  try {
    const outputs = JSON.parse(readFileSync('amplify_outputs.json', 'utf-8'));
    console.log('\n✅ amplify_outputs.json created successfully!');
    console.log('📝 Configuration saved to amplify_outputs.json');
  } catch (e) {
    console.log('\n⚠️  Could not read amplify_outputs.json automatically.');
    console.log('Please check the CLI output above for the configuration.');
  }

} catch (error) {
  console.error('\n❌ Error deploying backend:');
  console.error(error.message);
  console.log('\n💡 Make sure AWS credentials are configured:');
  console.log('   Run: npx @aws-amplify/backend-cli configure profile');
  process.exit(1);
}

