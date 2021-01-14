import {
  createAsyncThunk,
  createEntityAdapter,
  createReducer,
  EntityState,
} from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { StatusState } from "../../../helpers/helpers";
import { Invitation } from "../../../model/Invitation";
import { initialStatus } from "../../blog/redux/postsReducer";
import {
  AcceptInvitationRequestData,
  AcceptInvitationResponse,
} from "../API/acceptInvitation/acceptInvitationRequest";
import invitationsAPI from "../API/invitationsAPI";
import {
  RejectInvitationRequestData,
  RejectInvitationResponse,
} from "../API/rejectInvitation/rejectInvitation";
import {
  SendInvitationRequestData,
  SendInvitationResponse,
} from "../API/sendInvitation/sendInvitationRequest";

export type InvitationsState = {
  status: StatusState;
  invitations: EntityState<Invitation>;
};

export const invitationsActionsPrefix = "invitations";
export const invitationsAdapter = createEntityAdapter<Invitation>({
  selectId: (invitation) => invitation.invitationId,
});
export const invitationInitialState: InvitationsState = {
  status: initialStatus,
  invitations: invitationsAdapter.getInitialState(),
};
export const getInvitations = createAsyncThunk(
  `${invitationsActionsPrefix}/getInvitations`,
  async () => {
    return await invitationsAPI.requestGetInvitations();
  }
);
export const sendInvitation = createAsyncThunk<
  AxiosResponse<SendInvitationResponse>,
  SendInvitationRequestData
>(`${invitationsActionsPrefix}/sendInvitation`, async (data) => {
  return await invitationsAPI.requestSendInvitation(data);
});
export const rejectInvitation = createAsyncThunk<
  AxiosResponse<RejectInvitationResponse>,
  RejectInvitationRequestData
>(`${invitationsActionsPrefix}/rejectInvitation`, async (data) => {
  return await invitationsAPI.requestRejectInvitation(data);
});

export const acceptInvitation = createAsyncThunk<
  AxiosResponse<AcceptInvitationResponse>,
  AcceptInvitationRequestData
>(`${invitationsActionsPrefix}/acceptInvitation`, async (data) => {
  return await invitationsAPI.requestAcceptInvitation(data);
});
export const invitationsReducer = createReducer<InvitationsState>(
  invitationInitialState,
  (builder) => {
    builder
      .addCase(getInvitations.fulfilled, (state, action) => {
        const invitations = action.payload.data.invitations;
        state.status.error = null;
        state.status.loading = false;
        invitationsAdapter.setAll(state.invitations, invitations);
      })
      .addCase(rejectInvitation.fulfilled, (state, action) => {
        invitationsAdapter.removeOne(
          state.invitations,
          action.meta.arg.invitationId
        );
      })
      .addCase(acceptInvitation.fulfilled, (state, action) => {
        invitationsAdapter.removeOne(
          state.invitations,
          action.meta.arg.invitationId
        );
      });
  }
);

export const {
  selectAll: selectInvitations,
} = invitationsAdapter.getSelectors();
// //SELECTORS
// export const selectInvitationsState = (state: ApplicationState) => state.invitations;

// export const currentInvitationsSelectorLocal = createDraftSafeSelector(
//   (state: InvitationsState) => state,
//   (state) => state.currentInvitations
// );
// export const currentInvitationsSelector = createDraftSafeSelector(
//   selectInvitationsState,
//   (state) =>
//     state.currentInvitations
//       .map((invitationId) => invitationsSelectorsLocal.selectById(state.invitations, invitationId))
//       .filter((invitation) => invitation) as Invitation[]
// );
// export const finishedInvitationsLoading = createDraftSafeSelector(
//   selectInvitationsState,
//   (state) => state.loadedLatestInvitations
// );

// export const latestInvitationsSelector = createDraftSafeSelector(
//   selectInvitationsState,
//   (state) =>
//     state.latestInvitations
//       .map((invitationId) => invitationsSelectorsLocal.selectById(state.invitations, invitationId))
//       .filter((invitation) => invitation) as Invitation[]
// );
