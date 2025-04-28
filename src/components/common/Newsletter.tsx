import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';

// Validation schema
const formSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type FormValues = z.infer<typeof formSchema>;

export function Newsletter() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionState, setSubmissionState] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  // Handle form submission
  const onSubmit = async (_: FormValues) => {
    setIsSubmitting(true);
    setSubmissionState('idle');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Success scenario (in a real app, this would be an API call)
      // if (Math.random() > 0.2) { // 80% success rate for demo
      setSubmissionState('success');
      form.reset();
      // } else {
      //   // Error scenario
      //   throw new Error('Server is currently busy. Please try again later.');
      // }
    } catch (error) {
      setSubmissionState('error');
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Background pattern elements
  const backgroundPatterns = [
    { icon: '✈️', x: '5%', y: '15%', duration: 20 },
    { icon: '🏝️', x: '85%', y: '25%', duration: 23 },
    { icon: '🗺️', x: '70%', y: '85%', duration: 18 },
    { icon: '🧳', x: '25%', y: '75%', duration: 22 },
    { icon: '🌍', x: '50%', y: '10%', duration: 25 },
    { icon: '🏔️', x: '15%', y: '60%', duration: 19 },
  ];

  return (
    <section className="relative overflow-hidden bg-primary py-20">
      {/* Animated background patterns */}
      {backgroundPatterns.map((pattern, index) => (
        <motion.div
          key={index}
          className="absolute text-2xl opacity-10"
          style={{ x: pattern.x, y: pattern.y }}
          animate={{
            y: ['0%', '5%', '-5%', '0%'],
          }}
          transition={{
            duration: pattern.duration,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {pattern.icon}
        </motion.div>
      ))}

      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto max-w-3xl rounded-xl bg-white/10 p-8 backdrop-blur-sm">
          <div className="mb-8 text-center">
            <motion.h2 
              className="mb-3 text-3xl font-bold text-white"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Get Exclusive Travel Deals
            </motion.h2>
            <motion.p 
              className="mx-auto max-w-xl text-white/80"
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Subscribe to our newsletter and be the first to know about special offers, 
              new destinations, and travel tips from our experts.
            </motion.p>
          </div>

          {submissionState === 'success' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <Alert className="border-green-200 bg-green-50 text-green-800">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Thank you for subscribing! We've sent a confirmation email to your inbox.
                </AlertDescription>
              </Alert>
              <div className="mt-4 text-center">
                <Button
                  variant="outline"
                  className="border-white bg-white/20 text-white hover:bg-white/30"
                  onClick={() => setSubmissionState('idle')}
                >
                  Subscribe another email
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  {submissionState === 'error' && (
                    <Alert className="border-red-200 bg-red-50 text-red-800">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{errorMessage}</AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input
                              placeholder="Enter your email address"
                              className="border-white/30 bg-white/20 text-white placeholder:text-white/60 focus:border-white"
                              autoComplete="email"
                              disabled={isSubmitting}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red-200" />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="bg-white text-primary hover:bg-white/90"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className="mr-2 h-4 w-4 border-b-2 border-primary rounded-full"
                          />
                          <span>Subscribing...</span>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <span>Subscribe</span>
                          <Send className="ml-2 h-4 w-4" />
                        </div>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
              
              <div className="mt-6 text-center text-xs text-white/60">
                By subscribing, you agree to our 
                <a href="/privacy-policy" className="underline hover:text-white"> Privacy Policy</a> and 
                <a href="/terms-of-service" className="underline hover:text-white"> Terms of Service</a>.
                We send emails weekly and you can unsubscribe at any time.
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
} 