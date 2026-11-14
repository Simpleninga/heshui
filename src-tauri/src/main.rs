// 正式版在 Windows 上不弹黑色命令行窗口
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    tauri::Builder::default()
        .run(tauri::generate_context!())
        .expect("喝水打卡启动失败");
}
