# 使っている部品の出どころとライセンス

このページ（アーカイブ顔チェック Web 版）の本体の利用条件は、提供者が決めます。このファイルは、本体以外の部品についてです。
どの部品も、このページと同じ場所に置いたものを使い、動画や顔の画像をどこかへ送ることはありません。

| 部品 | 場所 | 出どころ | ライセンス |
|---|---|---|---|
| Mediabunny 1.61.6（動画の読み書き） | `pub/vendor/mediabunny/` | https://github.com/Vanilagy/mediabunny （変更なし） | MPL-2.0（`pub/vendor/mediabunny/LICENSE`） |
| ONNX Runtime Web（AI の計算） | `pub/vendor/ort/` | https://github.com/microsoft/onnxruntime （Microsoft） | MIT（下に全文） |
| Transformers.js（AI のモデルを動かす） | 本体の中（`app/vendor/transformers.min.js`） | https://github.com/huggingface/transformers.js （Hugging Face） | Apache-2.0 |
| YuNet（顔を探すモデル） | `pub/models/yunet/` | https://github.com/opencv/opencv_zoo/tree/main/models/face_detection_yunet （OpenCV Zoo・face_detection_yunet_2023mar） | MIT（Copyright (c) 2020 Shiqi Yu） |
| SFace（顔の見分けのモデル） | `pub/models/sface/` | https://github.com/opencv/opencv_zoo/tree/main/models/face_recognition_sface （OpenCV Zoo） | Apache-2.0 |
| PP-OCRv3 の文字の場所の検出（名前の表示の場所を探すモデル。文字は読まない） | `pub/models/ppocr_det/` | https://github.com/opencv/opencv_zoo/tree/main/models/text_detection_ppocr （OpenCV Zoo・text_detection_cn_ppocrv3_2023may。元は PaddleOCR） | Apache-2.0（`pub/models/ppocr_det/LICENSE`） |
| 見本の動画 | `pub/samples/` | NASA Image and Video Library の公開素材だけで作った、Zoom 風の録画（実在の参加者ではありません） | NASA の素材（パブリックドメイン。NASA が推薦・承認したように見せてはいけない） |

## ONNX Runtime（MIT License）

```
MIT License

Copyright (c) Microsoft Corporation

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## YuNet（MIT License）

```
MIT License

Copyright (c) 2020 Shiqi Yu <shiqi.yu@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

Apache-2.0 の全文：https://www.apache.org/licenses/LICENSE-2.0 ／ MPL-2.0 の全文：https://www.mozilla.org/MPL/2.0/
