import { Program, AnchorProvider } from "@project-serum/anchor";
export default class BaseInterface {
  _provider: AnchorProvider;
  _programAddress: string;
  _idl: any;
  _program: Program;

  constructor(provider: AnchorProvider, programAddress: string, idl: any) {
    this._provider = provider;
    this._programAddress = programAddress;
    this._idl = idl;
    this._program = new Program(idl, programAddress, provider);
  }
}
