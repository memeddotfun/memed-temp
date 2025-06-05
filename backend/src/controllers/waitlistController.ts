import { Request, Response } from 'express';
import prisma from '../clients/prisma';
import sendMail from '../functions/sendemail';
import { randomBytes } from 'crypto';
import { z } from 'zod';
import { verifyRecaptcha } from '../utils/recaptcha';

const waitlistSchema = z.object({
    email: z.string().email(),
    name: z.string(),
    recaptchaToken: z.string(),
});

const confirmSchema = z.object({    
    token: z.string(),
});

export const addWaitlist = async (req: Request, res: Response) => {
    try {
        const { email, name, recaptchaToken } = waitlistSchema.parse(req.body);
        if(!waitlistSchema.safeParse(req.body).success){
            return res.status(400).json({ message: 'Invalid request body' });
        }
        
        // Verify reCAPTCHA token with action and minimum score
        const isRecaptchaValid = await verifyRecaptcha(recaptchaToken, 'waitlist_submit', 0.5);
        if (!isRecaptchaValid) {
            return res.status(400).json({ message: 'reCAPTCHA verification failed. Please try again.' });
        }
        const emailExists = await prisma.waitlist.findUnique({ where: { email } });
        if (emailExists) {
          if (emailExists.status === 'PENDING') {
            await prisma.token.deleteMany({ where: { waitlistId: emailExists.id } });
            const token = randomBytes(64).toString('hex');
            await prisma.token.create({
                data: {
                    waitlistId: emailExists.id,
                    token,
                },
            });
            sendMail(email, name, token);
            
          }
            return res.status(400).json({ message: 'Email already exists' });
        }
        const waitlist = await prisma.waitlist.create({
            data: {
                email,
                name,
                status: 'PENDING',
            },
        });
        res.json({ message: 'Waitlist added successfully, check your email for verification' });
        const token = randomBytes(64).toString('hex');
        await prisma.token.create({
            data: {
                waitlistId: waitlist.id,
                token,
            },
        });
        sendMail(email, name, token); 
    } catch (error) {
        console.error('Error in addWaitlist:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const confirmWaitlist = async (req: Request, res: Response) => {
    try {
        if(!confirmSchema.safeParse(req.body).success){
            return res.status(400).json({ message: 'Invalid request body' });
        }
        const { token } = confirmSchema.parse(req.body);
        const tokenExists = await prisma.token.findUnique({ where: { token, waitlist: { status: 'PENDING' } } });
        if (!tokenExists) {
            return res.status(400).json({ message: 'Invalid token' });
        }
        const waitlist = await prisma.waitlist.update({
            where: { id: tokenExists.waitlistId },
            data: { status: 'JOINED' },
        });
        await prisma.token.deleteMany({ where: { waitlistId: tokenExists.waitlistId } });
        res.json({ message: 'Waitlist confirmed successfully' });
    } catch (error) {
        console.error('Error in confirmWaitlist:', error);
        res.status(500).json({ message: 'Server error' });
    }
};