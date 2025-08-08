import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  Box
} from '@mui/material';

const PlayerSelectionDialog = ({ open, onClose, onSelectPlayer, availablePlayers }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h5" textAlign="center" component="div">
          Selecciona tu número de jugador
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" textAlign="center" sx={{ mb: 3 }}>
          Elige qué jugador quieres ser en el juego del ultimátum:
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          {availablePlayers.map((playerNumber) => (
            <Grid item key={playerNumber}>
              <Button
                variant="contained"
                size="large"
                onClick={() => onSelectPlayer(playerNumber)}
                sx={{
                  minWidth: 80,
                  minHeight: 80,
                  fontSize: '1.5rem',
                  fontWeight: 'bold'
                }}
              >
                {playerNumber}
              </Button>
            </Grid>
          ))}
        </Grid>
        {availablePlayers.length === 0 && (
          <Box textAlign="center" sx={{ mt: 2 }}>
            <Typography variant="body1" color="error">
              No hay jugadores disponibles en este momento
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
      </DialogActions>
    </Dialog>
  );
};

PlayerSelectionDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSelectPlayer: PropTypes.func.isRequired,
  availablePlayers: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default PlayerSelectionDialog;