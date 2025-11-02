import { useNavigate } from 'react-router-dom';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function SubscriptionCancel() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-12 px-4 flex items-center justify-center min-h-screen">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-orange-100 flex items-center justify-center">
            <XCircle className="h-10 w-10 text-orange-600" />
          </div>
          <CardTitle className="text-2xl">Subscription Canceled</CardTitle>
          <CardDescription>
            You canceled the subscription process
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-600 mb-4">
            No charges have been made to your account. You can still subscribe at any time.
          </p>
          <p className="text-sm text-gray-500">
            If you have any questions, feel free to contact our support team.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button className="w-full" onClick={() => navigate('/subscription')}>
            View Plans Again
          </Button>
          <Button className="w-full" variant="outline" onClick={() => navigate('/')}>
            Go to Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
