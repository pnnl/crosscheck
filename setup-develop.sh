npm install --python=/usr/bin/python
npm run build -- --copy-files --no-demo
cd widget/js
npm install --python=/usr/bin/python
npm run prepublish
cd ..
pip install -e .
cd ..
jupyter nbextension install --py --symlink --sys-prefix crosscheck
jupyter nbextension enable --py --sys-prefix crosscheck
