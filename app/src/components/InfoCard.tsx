import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Patient } from '@prisma/client';

function InfoCard({ firstName, lastName, taxIdCode, age, sex, siteId }: Pick<Patient, 'firstName' | 'lastName' | 'age' | 'sex' | 'siteId' | 'taxIdCode'>) {
  return (
    <Card className='col-span-2'>
      <CardHeader>
        <CardTitle>Patient Data</CardTitle>
      </CardHeader>
      <CardContent className='grid grid-cols-[auto,1fr] gap-x-4 items-baseline'>
        <InfoItem label='Name' value={`${firstName} ${lastName}`} />
        <InfoItem label='Age' value={age} />
        <InfoItem label='Sex' value={sex} />
        <InfoItem label='Site ID' value={siteId} />
        <InfoItem label='Tax ID Code' value={taxIdCode} />
      </CardContent>
    </Card>
  );
}

function InfoItem({ label, value }: {label: string, value: any}) {
  return (
    <>
      <p className='font-semibold text-muted-foreground'>{label}:</p>
      <p className='text-lg'>{value}</p>
    </>
  );
}

export default InfoCard;