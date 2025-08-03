<?php

namespace App\Http\Controllers\addons\included;

use App\Http\Controllers\Controller;
use App\Models\Languages;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Validator;

class LanguageController extends Controller
{
    public function index(Request $request)
    {

        $getlanguages = Languages::get();

        if ($request->code == "") {
            foreach ($getlanguages as $firstlang) {
                $currantLang = Languages::where('code', $firstlang->code)->first();
                break;
            }
        } else {
            $currantLang = Languages::where('code', $request->code)->first();
        }
        $dir = base_path() . '/resources/lang/' . $currantLang->code;

        if (!is_dir($dir)) {
            $dir = base_path() . '/resources/lang/en';
        }
        $arrLabel   = json_decode(file_get_contents($dir . '/' . 'labels.json'));

        $arrMessage   = json_decode(file_get_contents($dir . '/' . 'messages.json'));


        return view('admin.included.language.index', compact('getlanguages', 'currantLang', 'arrLabel', 'arrMessage'));
    }

    public function add()
    {
        return view('admin.included.language.add');
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'code' => 'required',
            'layout' => 'required',
            'name' => 'required_with:code',
            'image.*' => 'mimes:jpeg,png,jpg,webp',
        ], [
            "code.required" => trans('messages.language_required'),
            "layout.required" => trans('messages.layout_required'),
            "name.required_with" => trans('messages.wrong'),
        ]);
        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        } else {

            $path = base_path('resources/lang/' . $request->code);
            if (!File::isDirectory($path)) {
                File::makeDirectory($path, 0777, true, true);
            }
            File::copyDirectory(base_path() . '/resources/lang/en', base_path() . '/resources/lang/' . $request->code);

            if ($request->default == 1) {
                Languages::where('is_default', '1')->update(array('is_default' => 2));
                $default = 1;
            } else {
                $default = 2;
            }

            $language = new Languages();
            $language->code = $request->code;
            $language->name = $request->name;
            $language->layout = $request->layout;
            $language->is_default = $default;
            if ($request->has('image')) {
                $flagimage = 'flag-' . uniqid() . "." . $request->file('image')->getClientOriginalExtension();
                $request->file('image')->move(storage_path('app/public/admin-assets/images/language/'), $flagimage);
                $language->image = $flagimage;
            }
            $language->is_available = 1;
            $language->save();
            return redirect('admin/language-settings')->with('success', trans('messages.success'));
        }
    }

    public function storeLanguageData(Request $request)
    {

        $langFolder = base_path() . '/resources/lang/' . $request->currantLang;

        if (!is_dir($langFolder)) {
            mkdir($langFolder);
            chmod($langFolder, 0777);
        }

        if (isset($request->file) == "label") {
            if (isset($request->label) && !empty($request->label)) {

                $content = "<?php return [";
                $contentjson = "{";
                foreach ($request->label as $key => $data) {
                    $content .= '"' . $key . '" => "' . str_replace('\\', '', addslashes($data)) . '",';
                    $contentjson .= '"' . $key . '":"' . $data . '",';
                }
                $content .= "];";
                $contentjson .= "}";

                file_put_contents($langFolder . "/labels.php", $content);
                file_put_contents($langFolder . "/labels.json", str_replace(",}", "}", $contentjson));
            }
        }

        if (isset($request->file) == "message") {
            if (isset($request->message) && !empty($request->message)) {

                $content = "<?php return [";
                $contentjson = "{";
                foreach ($request->message as $key => $data) {
                    $content .= '"' . $key . '" => "' . str_replace('\\', '', addslashes($data)) . '",';
                    $contentjson .= '"' . $key . '":"' . $data . '",';
                }
                $content .= "];";
                $contentjson .= "}";

                file_put_contents($langFolder . "/messages.php", $content);
                file_put_contents($langFolder . "/messages.json", str_replace(",}", "}", $contentjson));
            }
        }



        return redirect()->back()->with('success', trans('messages.success'));
    }

    public function layout(Request $request)
    {
        $language = Languages::find($request->id);
        $language->layout = $request->status;
        $language->save();
        if ($language) {
            return 1;
        } else {
            return 0;
        }
    }

    public function edit($id)
    {
        $getlanguage = Languages::where('id', $id)->first();
        return view('admin.included.language.edit', compact('getlanguage'));
    }

    public function update(Request $request, $id)
    {
        try {
            $validator = Validator::make($request->all(), [
                'layout' => 'required',
            ], [
                "layout.required" => trans('messages.layout_required'),
            ]);
            if ($validator->fails()) {
                return redirect()->back()->withErrors($validator)->withInput();
            } else {
                $default = 2;
                if ($request->default == 1) {
                    Languages::where('is_default', '1')->update(array('is_default' => 2));
                    $default = $request->default;
                }
                $language = Languages::where('id', $id)->first();
                $language->layout = $request->layout;
                $language->is_default = @$default;
                if ($request->has('image')) {
                    $flagimage = 'flag-' . uniqid() . "." . $request->file('image')->getClientOriginalExtension();
                    $request->file('image')->move(env('ASSETSPATHURL') . 'admin-assets/images/language/', $flagimage);
                    $language->image = $flagimage;
                }
                $language->update();
                return redirect('admin/language-settings')->with('success', trans('messages.success'));
            }
        } catch (\Throwable $th) {
            return redirect('admin/language-settings')->with('error', trans('messages.wrong'));
        }
    }

    public function status(Request $request)
    {
        $language = Languages::find($request->id);
        $language->is_available = $request->status;
        $language->save();
        if ($language) {
            return 1;
        } else {
            return 0;
        }
    }

    public function delete(Request $request)
    {
        try {
            $language = Languages::find($request->id);
            $setactive = Languages::where('code', 'en')->first();
            $setactive->is_available = 1;
            $setactive->update();
            $path = base_path('resources/lang/' . $language->code);
            if (File::exists($path)) {
                File::deleteDirectory($path);
            }
            if (file_exists(env('ASSETSPATHURL') . 'admin-assets/images/language/' . $language->image)) {
                unlink(env('ASSETSPATHURL') . 'admin-assets/images/language/' . $language->image);
            }
            $language->delete();
            return 1;
        } catch (\Throwable $th) {
            return 0;
        }
    }


    // Language change from header
    public function change(Request $request)
    {
        $layout = Languages::select('name', 'layout', 'image')->where('code', $request->lang)->first();
        App::setLocale($request->lang);
        session()->put('locale', $request->lang);
        session()->put('language', $layout->name);
        session()->put('flag', $layout->image);
        session()->put('direction', $layout->layout);
        return redirect()->back();
    }
}
