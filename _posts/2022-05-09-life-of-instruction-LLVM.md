---
layout: post
title: "LLVM 指令的一生 (Life of an instruction in LLVM)"
date: 2022-05-09
tags: [cs,llvm,cpp,compiler]
---
## 推荐阅读

- [Life of an instruction in LLVM - Eli Bendersky's website (thegreenplace.net)](https://eli.thegreenplace.net/2012/11/24/life-of-an-instruction-in-llvm)
- [【llvm-dev】 Writing a Pass in LLVM MC (Machine Code) level to Analyze Assembly Code](https://lists.llvm.org/pipermail/llvm-dev/2019-November/137251.html)
- Chapter ***"Understanding the machine code framework"*** - "***Getting Started with LLVM Core Libraries*** by Bruno and Rafael 
- [Building an LLVM backend.pdf - Fraser and Pierre-Andre](https://llvm.org/devmtg/2014-04/PDFs/Talks/Building an LLVM backend.pdf)
- [Lele's Memo: The `MC` Layer in LLVM (cnlelema.github.io)](https://cnlelema.github.io/memo/en/codegen/mc/)
- **[ushitora-anqou/write-your-llvm-backend: 手を動かせばできるLLVMバックエンド チュートリアル（WIP） (github.com)](https://github.com/ushitora-anqou/write-your-llvm-backend)**

---

## Life of an Instruction in LLVM

- [Life of an instruction in LLVM - Eli Bendersky's website (thegreenplace.net)](https://eli.thegreenplace.net/2012/11/24/life-of-an-instruction-in-llvm)
- [ushitora-anqou/write-your-llvm-backend: 手を動かせばできるLLVMバックエンド チュートリアル（WIP） (github.com)](https://github.com/ushitora-anqou/write-your-llvm-backend)
- [跟随一条指令来看LLVM的基本结构_P2Tree的博客-CSDN博客](https://blog.csdn.net/SiberiaBear/article/details/103836318)
- [compiler/life-of-instruction-LLVM.pdf at main · randoruf/compiler (github.com)](https://github.com/randoruf/compiler/blob/main/life-of-instruction-LLVM.pdf)

![image-20220509184936296](https://raw.githubusercontent.com/randoruf/photo-asset-repo/main/imgs/image-20220509184936296.png)

---

## LLVMバックエンドの流れ

- [write-your-llvm-backend/draft-cahpv3.asciidoc at master · ushitora-anqou/write-your-llvm-backend (github.com)](https://github.com/ushitora-anqou/write-your-llvm-backend/blob/master/draft-cahpv3.asciidoc#llvmバックエンドの流れ)

`CAHP*` はオーバーライドできるメンバ関数を表す。

```
LLVM IR code

|
|
v

SelectionDAG (SDNode); CAHPで扱えない型・操作を含む (not legal)。

|
|  <-- CAHPTargetLowering::CAHPTargetLowering
|  <-- CAHPTargetLowering::Lower*
v

SelectionDAG (SDNode); CAHPで扱える型・操作のみを含む (legal)。

|
|  <-- CAHPDAGToDAGISel, CAHPInstrInfo
v

SelectionDAG (MachineSDNode); ノードの命令は全てCAHPのもの。

|
|  <-- CAHPInstrInfo; 命令スケジューリング
v

LLVM MIR (MachineInstr); スケジューリングされた命令列

|  (以下の流れは TargetPassConfig::addMachinePasses に記述されている)
|
|  <-- CAHPTargetLowering::EmitInstrWithCustomInserter;
|          usesCustomInserter フラグが立っている ある MachineInstr の代わりに
|          複数の MachineInstr を挿入したり MachineBasicBlock を追加したりする。
|
|  <-- SSA上での最適化
|
|  <-- レジスタ割り付け
v

LLVM MIR (MachineInstr); 物理レジスタのみを含む命令列（仮想レジスタを含まない）

|
|  <-- CAHPInstrInfo::expandPostRAPseudo
|
|  <-- CAHPFrameLowering::processFunctionBeforeFrameFinalized
|
|  <-- スタックサイズの確定
|
|  <-- CAHPFrameLowering::emitPrologue; 関数プロローグの挿入
|  <-- CAHPFrameLowering::emitEpilogue; 関数エピローグの挿入
|  <-- CAHPRegisterInfo::eliminateFrameIndex; frame indexの消去
|
|  <-- llvm::scavengeFrameVirtualRegs;
|          frame lowering中に必要になった仮想レジスタをscavengeする
v

LLVM MIR (MachineInstr); frame index が削除された命令列

|
|  <-- CAHPPassConfig::addPreEmitPass
|  <-- CAHPPassConfig::addPreEmitPass2
|
|
|  <-- CAHPAsmPrinter
|  <-- PseudoInstExpansion により指定された擬似命令展開の実行
v

MC (MCInst); アセンブリと等価な中間表現
```

LLVM MIRについては[[46\]](https://github.com/ushitora-anqou/write-your-llvm-backend/blob/master/draft-cahpv3.asciidoc#llvm-welcome_to_the_back_end_2017)に詳しい。 各フェーズでの `MachineInstr` をデバッグ出力させる場合は `llc` に `-print-machineinstrs` を 渡せば良い。
