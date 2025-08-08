import { Typography, Grid, Box } from "@mui/material"
import NFTlogo from '../assets/logo.svg'

const Home = () => {
    return (
        <Grid container direction={{xs: 'column', md: 'row' }} justifyContent="center"  maxWidth="xl" sx={{ display: 'flex', alignItems: 'center', bgcolor: '#cfe8fc', minHeight: '80vh', borderRadius: 1, mt: 3, background: 'linear-gradient(to bottom, #F8F8F8, #FFFFFF)' }}>
            <Grid item xs={6} >
                <Typography sx={{ mt: 3, display: 'flex', alignItems: 'center', ml: 3, typography: {xs: 'h5', sm: 'h5', md:'h3', lg:'h3'  } }}>El juego del ultimatum</Typography>
                <Typography variant="h5" sx={{ mt: 3, display: 'flex', alignItems: 'center', ml: 3 }}>¿Aceptas o rechazas la oferta? </Typography>
            </Grid>
            <Grid item xs={6} container alignItems="center" justifyContent="center">
                <Box component="img"
                    sx={{maxHeight: { xs: 233, md: 400 }}}
                    alt="Logo"
                    src={NFTlogo}
                />
            </Grid>
        </Grid>
    )
}

export default Home

