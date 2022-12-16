import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { EVALUATION_STATUS } from "src/shared/constants";
import { PaginationParamsDto } from "src/shared/dtos/pagination-params.dto";

export class GetListAssetInput extends PaginationParamsDto {
  @ApiPropertyOptional({
    enum: EVALUATION_STATUS
  })
  @IsOptional()
  status: EVALUATION_STATUS
}