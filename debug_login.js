/**
 * Script to add debug logging to the authentication process
 * 
 * This script will:
 * 1. Create a modified version of the [...nextauth].ts file with debug logging
 * 2. Save it as [...nextauth].debug.ts for reference
 * 
 * Usage: node debug_login.js
 */

const fs = require('fs');
const path = require('path');

// Path to the NextAuth file
const nextAuthPath = path.join('src', 'pages', 'api', 'auth', '[...nextauth].ts');
const debugNextAuthPath = path.join('src', 'pages', 'api', 'auth', '[...nextauth].debug.ts');

// Function to add debug logging
function addDebugLogging() {
  try {
    // Read the original file
    console.log(`Reading file: ${nextAuthPath}`);
    const content = fs.readFileSync(nextAuthPath, 'utf8');

    // Add debug logging to the authorize function
    let modifiedContent = content.replace(
      /async authorize\(credentials\) {/,
      `async authorize(credentials) {
        console.log('NextAuth authorize called with credentials:', {
          email: credentials?.email,
          passwordProvided: !!credentials?.password
        });`
    );

    // Add debug logging for admin user lookup
    modifiedContent = modifiedContent.replace(
      /const adminUsers = await db\.executeQuery<any\[\]>\({/,
      `console.log('Looking for admin user with email:', credentials?.email);
        const adminUsers = await db.executeQuery<any[]>({`
    );

    // Add debug logging for admin user found
    modifiedContent = modifiedContent.replace(
      /if \(adminUsers\.length > 0\) {/,
      `if (adminUsers.length > 0) {
          console.log('Admin user found:', {
            id: adminUsers[0].id,
            email: adminUsers[0].email,
            role_id: adminUsers[0].role_id,
            role_name: adminUsers[0].role_name,
            is_active: adminUsers[0].is_active,
            passwordHash: adminUsers[0].password?.substring(0, 10) + '...'
          });`
    );

    // Add debug logging for password validation
    modifiedContent = modifiedContent.replace(
      /const isPasswordValid = await compare\(credentials\.password, adminUser\.password\);/,
      `console.log('Validating admin password...');
          const isPasswordValid = await compare(credentials.password, adminUser.password);
          console.log('Admin password validation result:', isPasswordValid);`
    );

    // Add debug logging for regular user lookup
    modifiedContent = modifiedContent.replace(
      /const users = await db\.executeQuery<any\[\]>\({/,
      `console.log('Looking for regular user with email:', credentials?.email);
        const users = await db.executeQuery<any[]>({`
    );

    // Add debug logging for regular user found
    modifiedContent = modifiedContent.replace(
      /if \(users\.length === 0\) {/,
      `if (users.length === 0) {
          console.log('No regular user found with this email');`
    );

    // Add debug logging for regular user password validation
    modifiedContent = modifiedContent.replace(
      /const isPasswordValid = await compare\(credentials\.password, user\.password\);/,
      `console.log('Regular user found:', {
            id: user.id,
            email: user.email,
            full_name: user.full_name,
            role_id: user.role_id,
            role_name: user.role_name,
            is_active: user.is_active,
            passwordHash: user.password?.substring(0, 10) + '...'
          });
          console.log('Validating regular user password...');
          const isPasswordValid = await compare(credentials.password, user.password);
          console.log('Regular user password validation result:', isPasswordValid);`
    );

    // Add debug logging for JWT token
    modifiedContent = modifiedContent.replace(
      /async jwt\({ token, user }\) {/,
      `async jwt({ token, user }) {
        console.log('JWT callback called with user:', user ? {
          id: user.id,
          email: user.email,
          role_id: user.role_id,
          role_name: user.role_name,
          isAdminUser: user.isAdminUser
        } : 'No user');`
    );

    // Add debug logging for session
    modifiedContent = modifiedContent.replace(
      /async session\({ session, token }\) {/,
      `async session({ session, token }) {
        console.log('Session callback called with token:', token ? {
          id: token.id,
          role_id: token.role_id,
          role_name: token.role_name,
          isAdminUser: token.isAdminUser
        } : 'No token');`
    );

    // Save the modified content to a new file
    console.log(`Writing debug version to: ${debugNextAuthPath}`);
    fs.writeFileSync(debugNextAuthPath, modifiedContent, 'utf8');

    console.log('\nDebug version created successfully!');
    console.log('To use the debug version:');
    console.log('1. Rename the original file to "[...nextauth].original.ts"');
    console.log('2. Rename the debug file to "[...nextauth].ts"');
    console.log('3. Restart the server and check the console for debug logs during login');
    console.log('4. After debugging, restore the original file');

  } catch (error) {
    console.error('Error adding debug logging:', error);
  }
}

// Run the function
addDebugLogging();
