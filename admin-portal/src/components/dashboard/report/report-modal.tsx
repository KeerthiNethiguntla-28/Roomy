import 'react-image-gallery/styles/css/image-gallery.css';

import * as React from 'react';
import { Chip, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { House, Image, Info, User } from '@phosphor-icons/react/dist/ssr';
import ImageGallery from 'react-image-gallery';

import { type Report } from '@/types/report';
import PropertyMap from '@/components/ui/property-map';
import { statusColors } from '@/styles/theme/color-schemes';

export default function PostModal({
  selectedReport,
  handleCloseModal,
}: {
  selectedReport: Report;
  handleCloseModal: () => void;
}): React.JSX.Element {
  const selectedPost = selectedReport.post;
  const images = selectedPost.photos.map((photo: { url: string }) => ({
    original: photo.url,
    thumbnail: photo.url, // Use the same URL for both original and thumbnail for simplicity
    originalAlt: selectedPost.title,
    thumbnailAlt: selectedPost.title,
  }));

  return (
    <Dialog
      open={Boolean(selectedPost)}
      onClose={handleCloseModal}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        style: {
          backgroundColor: '#f5f5f5', // Light background color
          padding: '24px', // Add some padding
          borderRadius: '8px', // Round the corners
        },
      }}
    >
      <DialogTitle>
        <Typography variant="h4" component="div" color="primary">
          {selectedPost.title}
        </Typography>
      </DialogTitle>
      <DialogContent>
        {selectedReport.description && selectedReport.description.length > 0 && (
          <Card variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Typography
                variant="body1"
                component="div"
                gutterBottom
                color="primary"
                sx={{ display: 'flex', alignItems: 'center' }}
              >
                <Info size={24} style={{ marginRight: '8px' }} /> Report Description
              </Typography>
              <Typography>{selectedReport.description}</Typography>
            </CardContent>
          </Card>
        )}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Card variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Typography
                  variant="h6"
                  component="div"
                  gutterBottom
                  color="primary"
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <House size={24} style={{ marginRight: '8px' }} /> Property Details
                </Typography>
                <Typography>
                  Street Address: {selectedPost.streetAddress}, {selectedPost.unitNo}
                </Typography>
                <Typography>
                  City: {selectedPost.city}, State: {selectedPost.stateCode}, Zip: {selectedPost.zipCode}
                </Typography>
                <Typography>Phone Number: {selectedPost.phoneNumber}</Typography>
                <Typography>Start Date: {new Date(selectedPost?.startDateRange).toLocaleDateString()}</Typography>
                <Typography>Price: ${selectedPost.price}</Typography>
                <Typography>Bedrooms: {selectedPost.bedCount}</Typography>
                <Typography>Bathrooms: {selectedPost.bathCount}</Typography>
                <Typography>Utilities: {selectedPost.utilities.join(', ')}</Typography>
                <Typography>Amenities: {selectedPost.amenities.join(', ')}</Typography>
              </CardContent>
            </Card>

            <Card variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Typography
                  variant="h6"
                  component="div"
                  gutterBottom
                  color="primary"
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <User size={24} style={{ marginRight: '8px' }} /> Reported By
                </Typography>
                <Typography>User Email: {selectedReport.user.email}</Typography>
                <Typography>User Name: {selectedReport.user.name}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Card variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Typography
                  variant="h6"
                  component="div"
                  gutterBottom
                  color="primary"
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <User size={24} style={{ marginRight: '8px' }} /> Post Author Details
                </Typography>
                <Typography>User Email: {selectedPost.user.email}</Typography>
                <Typography>User Name: {selectedPost.user.name}</Typography>
              </CardContent>
            </Card>

            <Card variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Typography
                  variant="h6"
                  component="div"
                  gutterBottom
                  color="primary"
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <Info size={24} style={{ marginRight: '8px' }} /> Other Details
                </Typography>
                <Typography>
                  Post ID: {selectedPost._id} | Version: {selectedPost.__v}
                </Typography>
                <Typography>
                  Active:
                  {
                    <Chip
                      color={statusColors[selectedPost.active ? 'active' : 'inactive']}
                      label={selectedPost.active ? 'Yes' : 'No'}
                      size="small"
                    />
                  }
                </Typography>
                <Typography>
                  Approved:
                  {
                    <Chip
                      color={statusColors[selectedPost.approved ? 'approved' : 'pending']}
                      label={selectedPost.approved ? 'Yes' : 'No'}
                      size="small"
                    />
                  }
                </Typography>
                {selectedPost.approved && selectedPost.approvedBy && (
                  <>
                    <Typography>
                      Approved By: {selectedPost.approvedBy.firstName + ' ' + selectedPost.approvedBy.lastName}
                    </Typography>
                    <Typography>Approved At: {new Date(selectedPost.approvedAt).toLocaleString()}</Typography>
                  </>
                )}
                <Typography>Created At: {new Date(selectedPost.createdAt).toLocaleString()}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {images && images.length > 0 && (
          <Card variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Typography
                variant="h6"
                component="div"
                gutterBottom
                color="primary"
                sx={{ display: 'flex', alignItems: 'center' }}
              >
                <Image size={24} style={{ marginRight: '8px' }} /> Photos
              </Typography>
              <ImageGallery
                items={images}
                showThumbnails
                showFullscreenButton
                showPlayButton={false}
              />
            </CardContent>
          </Card>
        )}
        {selectedPost.latitude && selectedPost.longitude && (
          <PropertyMap
            mapsInfo={{ latitute: selectedPost.latitude, longitude: selectedPost.longitude, price: selectedPost.price }}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCloseModal}
          style={{
            borderRadius: '20px', // Round the corners of the button
            boxShadow: 'none', // Remove the button box shadow
            textTransform: 'none', // Remove text transformation
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
