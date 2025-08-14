'use client'
import { Box, Modal, Stack, TextField, Typography, Button, IconButton, Card, CardContent, CardActions } from '@mui/material';
import { useState, useEffect } from 'react';
import { firestore } from '@/firebase';
import { collection, deleteDoc, getDoc, getDocs, query, setDoc, doc } from 'firebase/firestore';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete'; 
import AddIcon from '@mui/icons-material/Add'
import MinimizeIcon from '@mui/icons-material/Minimize';

export default function Home() {
  const [pantry, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [itemQuantity, setItemQuantity] = useState(1); 
  const [searchQuery, setSearchQuery] = useState('');

  const normalizeName = (name) => name.trim().toLowerCase();

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'pantry'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
  };

  const addItem = async (item) => {
    const normalizedItemName = normalizeName(item.name);
    const docRef = doc(collection(firestore, 'pantry'), normalizedItemName);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + item.quantity });
    } else {
      await setDoc(docRef, { quantity: item.quantity });
    }
    await updateInventory();
  };

  const removeItem = async (item) => {
    const normalizedItemName = normalizeName(item);
    const docRef = doc(collection(firestore, 'pantry'), normalizedItemName);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }

    await updateInventory();
  };

  const deleteItem = async (item) => {
    const normalizedItemName = normalizeName(item);
    const docRef = doc(collection(firestore, 'pantry'), normalizedItemName);
    await deleteDoc(docRef);
    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const filteredPantry = pantry.filter(item =>
    normalizeName(item.name).includes(normalizeName(searchQuery))
  );

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      border= 'ActiveBorder'
      p={3}
      bgcolor="#DEF5FF"
    >
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
          border="2px solid #001"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{ transform: 'translate(-50%, -50%)' }}
        >
          <Typography variant="h6">Add item</Typography>
          <Stack direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              label="Item name"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <TextField
              variant="outlined"
              type="number"
              label="Quantity"
              value={itemQuantity}
              onChange={(e) => setItemQuantity(Number(e.target.value))}
              inputProps={{ min: 1 }}
            />
            <Button
              variant="contained"
              onClick={() => {
                addItem({ name: itemName, quantity: itemQuantity });
                setItemName('');
                setItemQuantity(1);
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Typography variant="h3" gutterBottom>
        Pantry Inventory
      </Typography>

      <Box width="100%" maxWidth={800} mb={2} border = 'dashed'>
        <TextField
          variant="outlined"
          fullWidth
          placeholder="Search items"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <SearchIcon />
            ),
          }}
        />
      </Box>

      <Button variant="contained" onClick={handleOpen} sx={{ mb: 2 }}>
        Add New Item
      </Button>

      <Box width="100%" maxWidth={800} height = '600px' overflow = 'auto'  border="2px solid #ddd" 
        borderRadius={2} 
        bgcolor="#FFE1CA">


      <Stack spacing={2} bgcolor="#FFE1CA">
        {filteredPantry.map(({ name, quantity }) => (


          <Card key={name} bgcolor="#FFE1CA" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', overflow: 'scroll'}}>

            <CardContent variant = 'contained'>

              <Typography variant="contained">
                {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>

              <Typography variant="body2" color="text.secondary">Quantity: {quantity}</Typography>

            </CardContent>

            <CardActions>
              <IconButton size="small" variant="contained" color="success" onClick={() => addItem({ name, quantity: 1 })}><AddIcon/> </IconButton>
              <IconButton  size="small" variant="contained" color="error" onClick={() => removeItem(name)}><MinimizeIcon/></IconButton>
              <IconButton color="error" onClick={() => deleteItem(name)}>
                <DeleteIcon />
              </IconButton>
            </CardActions>
          </Card>
        ))}
      </Stack>
      </Box>
    </Box>
  );
}
