import { Box } from '@mui/material';

// Figma asset URLs
const imgRectangle1589 = "https://www.figma.com/api/mcp/asset/b429e348-f9bc-4a2c-90be-691f278ceb05";
const imgRectangle1612 = "https://www.figma.com/api/mcp/asset/855ad7e8-0ab6-4568-bc6c-a0677ad690bb";
const imgRectangle1611 = "https://www.figma.com/api/mcp/asset/fca6b476-ec36-4443-b822-1c1066428204";
const imgRectangle1613 = "https://www.figma.com/api/mcp/asset/be18bddf-fc95-45d6-a87e-ee7ecc38f3ec";

export default function PhotoCollage() {
  return (
    <Box
      sx={{
        position: 'relative',
        width: { lg: 450, xl: 550 },
        height: { lg: 350, xl: 420 },
        display: { xs: 'none', lg: 'block' },
      }}
    >
      {/* Yellow Circle 1 - Behind top left photo */}
      <Box
        sx={{
          position: 'absolute',
          left: -30,
          top: -20,
          width: 180,
          height: 180,
          bgcolor: '#eceba2',
          borderRadius: '50%',
          opacity: 0.8,
          zIndex: 0,
        }}
      />

      {/* Yellow Circle 2 - Behind bottom right */}
      <Box
        sx={{
          position: 'absolute',
          right: -40,
          bottom: -30,
          width: 150,
          height: 150,
          bgcolor: '#eceba2',
          borderRadius: '50%',
          opacity: 0.7,
          zIndex: 0,
        }}
      />

      {/* Small Yellow Circle - Top right */}
      <Box
        sx={{
          position: 'absolute',
          right: 30,
          top: 10,
          width: 40,
          height: 40,
          bgcolor: '#eceba2',
          borderRadius: '50%',
          opacity: 0.9,
          zIndex: 5,
        }}
      />

      {/* Large Back Photo Frame */}
      <Box
        sx={{
          position: 'absolute',
          right: -20,
          top: 30,
          width: { lg: 340, xl: 400 },
          height: { lg: 260, xl: 300 },
          bgcolor: 'white',
          boxShadow: '0px 5px 5px -1px rgba(0,37,40,0.1)',
          p: 1.5,
          zIndex: 1,
        }}
      >
        <Box
          component="img"
          src={imgRectangle1589}
          alt="Venue"
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </Box>

      {/* Rotated Photo 1 - Top Left (15deg) */}
      <Box
        sx={{
          position: 'absolute',
          left: 10,
          top: 20,
          transform: 'rotate(15deg)',
          zIndex: 3,
        }}
      >
        <Box
          sx={{
            width: { lg: 140, xl: 160 },
            height: { lg: 100, xl: 120 },
            bgcolor: 'white',
            boxShadow: '0px 5px 5px -1px rgba(0,37,40,0.1)',
            p: 1.2,
          }}
        >
          <Box
            component="img"
            src={imgRectangle1612}
            alt="Venue"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </Box>
      </Box>

      {/* Rotated Photo 2 - Middle Left (-15deg) */}
      <Box
        sx={{
          position: 'absolute',
          left: 0,
          top: { lg: 150, xl: 180 },
          transform: 'rotate(-15deg)',
          zIndex: 2,
        }}
      >
        <Box
          sx={{
            width: { lg: 180, xl: 210 },
            height: { lg: 130, xl: 150 },
            bgcolor: 'white',
            boxShadow: '0px 5px 5px -1px rgba(0,37,40,0.1)',
            p: 1.2,
          }}
        >
          <Box
            component="img"
            src={imgRectangle1611}
            alt="Venue"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </Box>
      </Box>

      {/* Rotated Photo 3 - Bottom Right (15deg) */}
      <Box
        sx={{
          position: 'absolute',
          right: 20,
          bottom: 0,
          transform: 'rotate(15deg)',
          zIndex: 4,
        }}
      >
        <Box
          sx={{
            width: { lg: 150, xl: 170 },
            height: { lg: 110, xl: 130 },
            bgcolor: 'white',
            boxShadow: '0px 5px 5px -1px rgba(0,37,40,0.1)',
            p: 1.2,
          }}
        >
          <Box
            component="img"
            src={imgRectangle1613}
            alt="Venue"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
