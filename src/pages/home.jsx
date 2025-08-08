import { Typography, Grid, Box } from "@mui/material"
import NFTlogo from '../assets/logo.svg'

const Home = () => {
    return (
        <Grid 
            container 
            direction={{xs: 'column', md: 'row' }} 
            justifyContent="center"  
            maxWidth="xl" 
            sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                bgcolor: '#cfe8fc', 
                minHeight: '80vh', 
                borderRadius: 1, 
                mt: { xs: 1, md: 3 }, 
                background: 'linear-gradient(to bottom, #F8F8F8, #FFFFFF)',
                boxShadow: { xs: '0 4px 12px rgba(0, 0, 0, 0.1)', md: '0 8px 24px rgba(0, 0, 0, 0.12)' },
                overflow: 'hidden'
            }}
        >
            <Grid 
                item 
                xs={12} 
                md={6}
                sx={{ 
                    order: { xs: 2, md: 1 },
                    px: { xs: 1, sm: 2, md: 4 },
                    py: { xs: 1.5, md: 3 },
                    textAlign: { xs: 'center', md: 'left' }
                }}
            >
                <Typography 
                    sx={{ 
                        mt: { xs: 1, md: 3 }, 
                        mb: { xs: 2, md: 3 },
                        typography: { xs: 'h4', sm: 'h4', md: 'h3', lg: 'h2' },
                        fontWeight: { xs: 700, md: 600 },
                        lineHeight: { xs: 1.2, md: 1.3 },
                        color: 'primary.main',
                        letterSpacing: { xs: '-0.5px', md: '0px' }
                    }}
                >
                    El Experimento del Ultimátum
                </Typography>
                <Typography 
                    variant="h5" 
                    sx={{ 
                        mt: { xs: 1, md: 3 }, 
                        fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
                        fontWeight: { xs: 500, md: 400 },
                        color: 'text.secondary',
                        lineHeight: { xs: 1.4, md: 1.5 },
                        maxWidth: { xs: '100%', md: '90%' }
                    }}
                >
                    ¿Aceptas o rechazas la oferta?
                </Typography>
            </Grid>
            <Grid 
                item 
                xs={12} 
                md={6} 
                container 
                alignItems="center" 
                justifyContent="center"
                sx={{ 
                    order: { xs: 1, md: 2 },
                    py: { xs: 3, md: 0 }
                }}
            >
                <Box 
                    component="img"
                    sx={{
                        maxHeight: { xs: 200, sm: 250, md: 300, lg: 400 },
                        width: 'auto',
                        maxWidth: { xs: '90%', sm: '80%', md: '100%' },
                        filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))',
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                            transform: { xs: 'scale(1.02)', md: 'scale(1.05)' }
                        }
                    }}
                    alt="Logo del Experimento"
                    src={NFTlogo}
                />
            </Grid>
        </Grid>
    )
}

export default Home

