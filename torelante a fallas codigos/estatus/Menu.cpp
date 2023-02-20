#include <windows.h>
#include <string>

int main()
{
    HKEY hkey;
    std::string path = "C:\\Users\\sonic\\AppData\\Local\\Programs\\Microsoft VS Code\\code.exe";

    RegCreateKey(HKEY_CURRENT_USER, "Software\\Microsoft\\Windows\\CurrentVersion\\Run", &hkey);
    RegSetValueEx(hkey, "Code", 0, REG_SZ, (BYTE*)path.c_str(), (path.size() + 1) * sizeof(wchar_t));
    RegCloseKey(hkey);
}