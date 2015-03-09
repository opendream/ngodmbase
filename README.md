### setup

    mkdir -p static/app
    cd static/app

    git clone git@github.com:opendream/ngodmbase.git odmbase
    cp -a odmbase/default/ ../..
    cd ../..

    vi bower.json // change project_implement_override to your project name
    vi package.json // change project_implement_override to your project name

    gem install sass
    gem install compass --pre
    npm install
    npm install --global gulp
    bower install


### management

    gulp
