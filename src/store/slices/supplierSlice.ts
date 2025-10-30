import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from "../../services/api/supplierApi";
import { Supplier, SupplierState } from "../../layouts/admin/types/supplier.type";

export const fetchSuppliers = createAsyncThunk<Supplier[]>(
  "suppliers/fetchSuppliers",
  async () => {
    const response = await getSuppliers();
    return response;
  }
);

export const createSupplierAsync = createAsyncThunk<Supplier, Partial<Supplier>>(
  "suppliers/createSupplier",
  async (supplierData) => {
    const response = await createSupplier(supplierData);
    return response;
  }
);

export const updateSupplierAsync = createAsyncThunk<
  Supplier,
  { id: string; supplierData: Partial<Supplier> }
>("suppliers/updateSupplier", async ({ id, supplierData }) => {
  const response = await updateSupplier(id, supplierData);
  return response;
});

export const deleteSupplierAsync = createAsyncThunk<string, string>(
  "suppliers/deleteSupplier",
  async (id) => {
    await deleteSupplier(id);
    return id;
  }
);

const initialState: SupplierState = {
  suppliers: [],
  status: "idle",
  error: null,
};

const supplierSlice = createSlice({
  name: "suppliers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSuppliers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSuppliers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.suppliers = action.payload;
      })
      .addCase(fetchSuppliers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch suppliers";
      })
      .addCase(createSupplierAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createSupplierAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.suppliers.push(action.payload);
      })
      .addCase(createSupplierAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to create supplier";
      })
      .addCase(updateSupplierAsync.fulfilled, (state, action) => {
        const updatedSupplier = action.payload;
        const index = state.suppliers.findIndex(
          (supplier) => supplier.id === updatedSupplier.id
        );
        if (index !== -1) {
          state.suppliers[index] = updatedSupplier;
        }
      })
      .addCase(deleteSupplierAsync.fulfilled, (state, action) => {
        state.suppliers = state.suppliers.filter(
          (supplier) => supplier.id !== action.payload
        );
      });
  },
});

export default supplierSlice.reducer;

