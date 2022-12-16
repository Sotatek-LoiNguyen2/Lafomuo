import React from "react";
import { AssetStatusType } from "../AssestTable/AssetTable.component";
import MintedAsset from "./MintedAsset";
import PassedAsset from "./PassedAsset";
import PendingAsset from "./PendingAsset";
import TokenizedAsset from "./TokenizedAsset";

interface AssetInfo {
  assetInfo: any | null;
  type: AssetStatusType;
}
const PropertyDetail = ({ assetInfo, type }: AssetInfo) => {
  if (!type || !assetInfo) return <></>;
  const _type = type.toUpperCase();

  if (_type === AssetStatusType.PENDING)
    return <PendingAsset assetInfo={assetInfo} />;

  if (_type === AssetStatusType.PASSED)
    return <PassedAsset assetInfo={assetInfo} />;

  if (type === AssetStatusType.MINTED)
    return <MintedAsset assetInfo={assetInfo} />;

  if (_type === AssetStatusType.TOKENIZED)
    return <TokenizedAsset assetInfo={assetInfo} />;

  return <></>;
};
export default PropertyDetail;
