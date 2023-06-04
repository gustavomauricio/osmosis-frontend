import {
  CosmosQueries,
  IAccountStore,
  IQueriesStore,
} from "@keplr-wallet/stores";
import {
  ChainStore,
  DerivedDataStore as BaseDerivedDataStore,
  IPriceStore,
  ObservableQueryActiveGauges,
  ObservableQueryPoolFeesMetrics,
  OsmosisQueries,
} from "@osmosis-labs/stores";
import { DeepReadonly } from "utility-types";

import { ObservableMergedPositionsByAddress } from "~/stores/derived-data/concentrated-liquidity";

import { ObservableAssets } from "../assets";
import {
  ObservablePoolsWithMetrics,
  ObservableVerifiedPoolsStoreMap,
} from "./pools";

/** Contains stores that compute on the lower level stores. */
export class DerivedDataStore extends BaseDerivedDataStore {
  public readonly poolsWithMetrics: DeepReadonly<ObservablePoolsWithMetrics>;
  public readonly verifiedPoolsStore: DeepReadonly<ObservableVerifiedPoolsStoreMap>;

  public readonly mergedPositionsByAddress: DeepReadonly<ObservableMergedPositionsByAddress>;
  constructor(
    protected readonly osmosisChainId: string,
    protected readonly queriesStore: IQueriesStore<
      CosmosQueries & OsmosisQueries
    >,
    protected readonly externalQueries: {
      queryGammPoolFeeMetrics: ObservableQueryPoolFeesMetrics;
      queryActiveGauges: ObservableQueryActiveGauges;
    },
    protected readonly accountStore: IAccountStore,
    protected readonly priceStore: IPriceStore,
    protected readonly chainGetter: ChainStore,
    protected readonly assetStore: ObservableAssets
  ) {
    super(
      osmosisChainId,
      queriesStore,
      externalQueries,
      accountStore,
      priceStore,
      chainGetter
    );

    this.verifiedPoolsStore = new ObservableVerifiedPoolsStoreMap(
      this.osmosisChainId,
      this.queriesStore,
      this.assetStore
    );
    this.poolsWithMetrics = new ObservablePoolsWithMetrics(
      this.osmosisChainId,
      this.queriesStore,
      this.verifiedPoolsStore,
      this.poolDetails,
      this.poolsBonding,
      this.chainGetter,
      this.externalQueries,
      this.priceStore
    );
    this.mergedPositionsByAddress = new ObservableMergedPositionsByAddress(
      this.osmosisChainId,
      this.queriesStore
    );
  }
}
