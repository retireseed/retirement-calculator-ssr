import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import RetirementCalculator from '../components/RetirementCalculator';


export default function RetirementCalculatorPage() {
  const theme = useTheme();
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <>
       <RetirementCalculator /> 
      {/* {isMobile ? <RetirementCalculator /> :     <MobileRetirementCalculator />}  */}
    </>
  );
}