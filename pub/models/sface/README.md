# SFace（顔の見分け用）
- 入手元: https://github.com/opencv/opencv_zoo/tree/main/models/face_recognition_sface
- ファイル: face_recognition_sface_2021dec.onnx（38,696,353 バイト、SHA-256 0ba9fbfa01b5270c96627c4ef784da859931e02f04419c829e83484087c34e79）→ `onnx/model.onnx`
- ライセンス: Apache-2.0（同フォルダの LICENSE に準じる）
- 使い方: 目鼻で位置をそろえた 112x112 の顔（RGB・0〜255）を入れると 128 次元の特徴が出る。同じ人は余弦類似度がおよそ 0.36 以上。
