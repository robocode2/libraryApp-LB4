import { injectable, inject } from "@loopback/core";
import { Filter } from "@loopback/repository";
import { List } from "../../../models";
import { BaseListRepository } from "../../../repositories";
import { Base } from "../../../repositories/keys";
import { IListAccessService } from "../../domain/services";
import { Auth } from "../../keys";

export interface IListAccessDTO {
  listId: number;
  userId: string;
}

export interface IUseCase<Request, Response> {
    execute(request: Request): Promise<Response>;
}

export interface IOwnListOnlyUseCase extends IUseCase<IListAccessDTO, boolean> {
  authorize(dto: IListAccessDTO): Promise<boolean>;
}

@injectable({ tags: { key: Auth.UseCase.OWN_LIST_ONLY } })
export class OwnListOnlyUseCase implements IOwnListOnlyUseCase {
  constructor(
    @inject(Base.Repository.LIST) private listRepository: BaseListRepository,
    @inject(Auth.Service.LIST_ACCESS) private listAccessService: IListAccessService
  ) {}

  public async execute(dto: IListAccessDTO): Promise<boolean> {
    return this.authorize(dto);
  }

  public async authorize(dto: IListAccessDTO): Promise<boolean> {
    const requestedListId: number = dto.listId;
    const userId: string = dto.userId;
    await this.listRepository.findById(requestedListId)

    try {
        const filter: Filter<List> = { where: { userId } };
        const ownedListIds: number[] = (await this.listRepository.find(filter, undefined)).map((list: List) => list.id);  
        return this.listAccessService.isAuthorized(ownedListIds, requestedListId);
    } catch (error) {
      return false;
    }
  }
}
