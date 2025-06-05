import { RecaptchaEnterpriseServiceClient } from '@google-cloud/recaptcha-enterprise';

/**
 * Verifies a Google reCAPTCHA token using the reCAPTCHA Enterprise API
 * @param token The reCAPTCHA token to verify
 * @param action The expected action name (optional)
 * @param minScore The minimum score to consider valid (0.0 to 1.0, default: 0.5)
 * @returns A promise that resolves to a boolean indicating whether the token is valid
 */
export const verifyRecaptcha = async (
  token: string,
  action?: string,
  minScore: number = 0.5
): Promise<boolean> => {
  try {
    const projectID = process.env.RECAPTCHA_PROJECT_ID || "plexiform-bot-462008-g7";
    const recaptchaKey = process.env.RECAPTCHA_SITE_KEY || "6Lc5YlYrAAAAAOcEIyyS92nTbEQqe5a8nWieYRmS";
    const recaptchaAction = action || "waitlist_submit";
    // Create the reCAPTCHA client
    const client = new RecaptchaEnterpriseServiceClient();
    const projectPath = client.projectPath(projectID);

    // Build the assessment request
    const request = {
      assessment: {
        event: {
          token: token,
          siteKey: recaptchaKey,
        },
      },
      parent: projectPath,
    };

    const [response] = await client.createAssessment(request);
    
    // Close the client when done
    await client.close();

    // Check if response has tokenProperties
    if (!response || !response.tokenProperties) {
      console.log('Invalid reCAPTCHA response: missing tokenProperties');
      return false;
    }
    
    // Check if the token is valid
    if (!response.tokenProperties.valid) {
      console.log(`reCAPTCHA token invalid: ${response.tokenProperties.invalidReason || 'unknown reason'}`);
      return false;
    }

    // Check if the expected action was executed
    if (action && response.tokenProperties.action !== recaptchaAction) {
      console.log(`reCAPTCHA action mismatch: expected=${recaptchaAction}, got=${response.tokenProperties.action || 'undefined'}`);
      return false;
    }

    // Check if response has riskAnalysis
    if (!response.riskAnalysis) {
      console.log('Invalid reCAPTCHA response: missing riskAnalysis');
      return false;
    }
    
    // Get the risk score
    const score = response.riskAnalysis.score;
    
    // Check if score exists
    if (score === undefined || score === null) {
      console.log('Invalid reCAPTCHA response: missing score');
      return false;
    }
    
    console.log(`reCAPTCHA score: ${score}`);
    
    // Log reasons if available
    if (response.riskAnalysis.reasons && response.riskAnalysis.reasons.length > 0) {
      console.log('Risk reasons:', response.riskAnalysis.reasons);
    }

    // Check if the score meets the minimum threshold
    if (score < minScore) {
      console.log(`reCAPTCHA score too low: ${score} < ${minScore}`);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error verifying reCAPTCHA token:', error);
    return false;
  }
};