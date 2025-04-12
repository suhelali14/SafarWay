import { Helmet } from 'react-helmet-async';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';

export function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>About Us | SafarWay</title>
        <meta name="description" content="Learn about SafarWay's mission to make travel accessible and enjoyable for everyone." />
      </Helmet>

      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-4xl font-bold">About SafarWay</h1>
        
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Our Mission</CardTitle>
              <CardDescription>Making travel accessible and enjoyable for everyone</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                At SafarWay, we believe that travel should be accessible to everyone. Our platform connects travelers with trusted travel agencies, making it easy to discover and book amazing experiences around the world.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Why Choose Us</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="mb-2 text-lg font-semibold">Trusted Partners</h3>
                <p className="text-gray-600">We carefully vet all our partner agencies to ensure high-quality service.</p>
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold">Best Prices</h3>
                <p className="text-gray-600">Find competitive prices and exclusive deals on travel packages.</p>
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold">24/7 Support</h3>
                <p className="text-gray-600">Our dedicated support team is always here to help with your travel needs.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <h2 className="mb-4 text-2xl font-bold">Ready to Start Your Journey?</h2>
          <div className="flex justify-center gap-4">
            <Button size="lg">Browse Packages</Button>
            <Button size="lg" variant="outline">Contact Us</Button>
          </div>
        </div>
      </div>
    </div>
  );
} 