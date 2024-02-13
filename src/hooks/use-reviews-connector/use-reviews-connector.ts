/// <reference path="../../../@types/commercetools__sync-actions/index.d.ts" />
/// <reference path="../../../@types-extensions/graphql-ctp/index.d.ts" />

import type { ApolloError } from '@apollo/client';
import {
  useMcQuery,
  // useMcMutation,
} from '@commercetools-frontend/application-shell';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
// import { createSyncChannels } from '@commercetools/sync-actions';
import type { TDataTableSortingState } from '@commercetools-uikit/hooks';
import type {
  TFetchReviewsQuery,
  TFetchReviewsQueryVariables,
} from '../../types/generated/ctp';
// import {
//   createGraphQlUpdateActions,
//   extractErrorFromGraphQlResponse,
//   convertToActionData,
// } from '../../helpers';
// import FetchChannelsQuery from './fetch-channels.ctp.graphql';
// import FetchChannelDetailsQuery from './fetch-channel-details.ctp.graphql';
// import UpdateChannelDetailsMutation from './update-channel-details.ctp.graphql';
import FetchReviewsQuery from './fetch-reviews.ctp.graphql';

// const syncChannels = createSyncChannels();

type PaginationAndSortingProps = {
  page: { value: number };
  perPage: { value: number };
  tableSorting: TDataTableSortingState;
};
type TUseReviewsFetcher = (
  paginationAndSortingProps: PaginationAndSortingProps
) => {
  reviewsPaginatedResult?: TFetchReviewsQuery['reviews'];
  error?: ApolloError;
  loading: boolean;
};

export const useReviewsFetcher: TUseReviewsFetcher = ({
  page,
  perPage,
  tableSorting,
}) => {
  const { data, error, loading } = useMcQuery<
    TFetchReviewsQuery,
    TFetchReviewsQueryVariables
  >(FetchReviewsQuery, {
    variables: {
      limit: perPage.value,
      offset: (page.value - 1) * perPage.value,
      sort: [`${tableSorting.value.key} ${tableSorting.value.order}`],
    },
    context: {
      target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
    },
  });

  return {
    reviewsPaginatedResult: data?.reviews,
    error,
    loading,
  };
};

// type TUseChannelDetailsFetcher = (channelId: string) => {
//   channel?: TFetchChannelDetailsQuery['channel'];
//   error?: ApolloError;
//   loading: boolean;
// };
//
// export const useChannelDetailsFetcher: TUseChannelDetailsFetcher = (
//   channelId
// ) => {
//   const { data, error, loading } = useMcQuery<
//     TFetchChannelDetailsQuery,
//     TFetchChannelDetailsQueryVariables
//   >(FetchChannelDetailsQuery, {
//     variables: {
//       channelId,
//     },
//     context: {
//       target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
//     },
//   });
//
//   return {
//     channel: data?.channel,
//     error,
//     loading,
//   };
// };
//
// export const useChannelDetailsUpdater = () => {
//   const [updateChannelDetails, { loading }] = useMcMutation<
//     TUpdateChannelDetailsMutation,
//     TUpdateChannelDetailsMutationVariables
//   >(UpdateChannelDetailsMutation);
//
//   const execute = async ({
//     originalDraft,
//     nextDraft,
//   }: {
//     originalDraft: NonNullable<TFetchChannelDetailsQuery['channel']>;
//     nextDraft: unknown;
//   }) => {
//     const actions = syncChannels.buildActions(
//       nextDraft,
//       convertToActionData(originalDraft)
//     );
//     try {
//       return await updateChannelDetails({
//         context: {
//           target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
//         },
//         variables: {
//           channelId: originalDraft.id,
//           version: originalDraft.version,
//           actions: createGraphQlUpdateActions(actions),
//         },
//       });
//     } catch (graphQlResponse) {
//       throw extractErrorFromGraphQlResponse(graphQlResponse);
//     }
//   };
//
//   return {
//     loading,
//     execute,
//   };
// };
