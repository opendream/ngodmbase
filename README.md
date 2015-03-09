### setup

    cd static
    mkdir -p static/app
    cd static/app

    git clone git@github.com:opendream/ngodmbase.git odmbase
    cp -R odmbase/default/. ../
    cp -R odmbase/requirements/. ../../
    cd ..

    npm install
    npm install --global gulp

