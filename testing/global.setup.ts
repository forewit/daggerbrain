import { clerkSetup } from '@clerk/testing/playwright';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env file from testing directory or parent directory
config({ path: resolve(process.cwd(), '.env') });
config({ path: resolve(process.cwd(), '..', '.env') });

/**
 * Global setup for Playwright tests with Clerk
 * 
 * This runs once before all tests and configures Clerk with API keys.
 * Requires CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY in .env file
 */
async function globalSetup() {
	// Disable TLS certificate validation (for corporate networks/proxies)
	process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
	
	// Check if keys are loaded
	const publishableKey = process.env.CLERK_PUBLISHABLE_KEY;
	const secretKey = process.env.CLERK_SECRET_KEY;
	
	if (!publishableKey) {
		throw new Error(
			'CLERK_PUBLISHABLE_KEY not found. Set it in .env file in the testing directory or parent directory.'
		);
	}
	if (!secretKey) {
		throw new Error(
			'CLERK_SECRET_KEY not found. Set it in .env file in the testing directory or parent directory.'
		);
	}
	
	// Validate key formats
	if (!publishableKey.startsWith('pk_test_') && !publishableKey.startsWith('pk_live_')) {
		console.warn('Warning: CLERK_PUBLISHABLE_KEY should start with pk_test_ or pk_live_');
	}
	if (!secretKey.startsWith('sk_test_') && !secretKey.startsWith('sk_live_')) {
		console.warn('Warning: CLERK_SECRET_KEY should start with sk_test_ or sk_live_');
	}
	
	// Setup Clerk
	try {
		console.log('Setting up Clerk testing environment...');
		await clerkSetup();
		console.log('Clerk setup completed successfully');
	} catch (error: any) {
		console.error('Failed to setup Clerk:', error.message);
		console.error('Error details:', error);
		console.error('\nTroubleshooting:');
		console.error('1. Make sure you\'re using test/dev API keys (pk_test_* and sk_test_*)');
		console.error('2. Verify your API keys are correct in your .env file');
		console.error('3. Check that you have network access to Clerk API');
		console.error('4. Ensure your Clerk instance is in development mode');
		throw error;
	}
}

export default globalSetup;
