import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../../services/api/userApi";
import { User, UserState } from "../../layouts/admin/types/user.type";

interface PaginatedUsers {
  users: User[];
  totalPages: number;
  currentPage: number;
}

export const fetchUsers = createAsyncThunk<
  PaginatedUsers,
  { page?: number; limit?: number }
>("users/fetchUsers", async ({ page = 1, limit = 10 }) => {
  const response = await getUsers(page, limit);
  return response;
});

export const createUserAsync = createAsyncThunk<User, Partial<User>>(
  "users/createUser",
  async (userData) => {
    const response = await createUser(userData);
    return response;
  }
);

export const updateUserAsync = createAsyncThunk<
  User,
  { id: string; userData: Partial<User> }
>("users/updateUser", async ({ id, userData }) => {
  const response = await updateUser(id, userData);
  return response;
});

export const deleteUserAsync = createAsyncThunk<string, string>(
  "users/deleteUser",
  async (id) => {
    await deleteUser(id);
    return id;
  }
);

const initialState: UserState = {
  users: [],
  totalPages: 1,
  currentPage: 1,
  status: "idle",
  error: null,
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users = action.payload.users;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch users";
      })
      .addCase(createUserAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createUserAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users.push(action.payload);
      })
      .addCase(createUserAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to create user";
      })
      .addCase(updateUserAsync.fulfilled, (state, action) => {
        const updatedUser = action.payload;
        const index = state.users.findIndex(
          (user) => user.id === updatedUser.id
        );
        if (index !== -1) {
          state.users[index] = updatedUser;
        }
      })
      .addCase(deleteUserAsync.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user.id !== action.payload);
      });
  },
});

export default userSlice.reducer;
