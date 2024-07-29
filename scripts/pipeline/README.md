# Howto

vi ~/.ssh/config


Host lambda_pipeline
     Hostname 0.0.0.0
     User ubuntu
     Port 22

Host lambda_pipeline_2
     Hostname 0.0.0.0
     User ubuntu
     Port 22

Host lambda_pipeline_3
     Hostname 129.146.0.6
     User ubuntu
     Port 22


cd ~/Projects/_wallets/code/ad-creator


scp -i scripts/pipeline/keys/wallets-lambda-mac.pem -r scripts/pipeline/blender_files/ lambda_pipeline:~/.
scp -i scripts/pipeline/keys/wallets-lambda-mac.pem -r scripts/pipeline/blender_files/ lambda_pipeline_2:~/.
scp -i scripts/pipeline/keys/wallets-lambda-mac.pem -r scripts/pipeline/blender_files/ lambda_pipeline_3:~/.

ssh -i scripts/pipeline/keys/wallets-lambda-mac.pem lambda_pipeline
ssh -i scripts/pipeline/keys/wallets-lambda-mac.pem lambda_pipeline_2
ssh -i scripts/pipeline/keys/wallets-lambda-mac.pem lambda_pipeline_3


cp -r csv_data/* ~/ad-creator-fs-az/public/sku/data/.

scp -i scripts/pipeline/keys/wallets-lambda-mac.pem -r public/sku/data/selected_products.fh.csv lambda_pipeline:~/blender_files/.

rsync -avL --progress -e "ssh -i scripts/pipeline/keys/wallets-lambda-mac.pem"  public/sku/ lambda_pipeline:~/ad-creator-fs-az/public/sku/

cd blender_files
./setup.sh

cp -r csv_data/* ~/ad-creator-fs-az/public/sku/data/.

cd {root directory}

rsync -avL --progress -e "ssh -i scripts/pipeline/keys/wallets-lambda-mac.pem"  public/sku/ lambda_pipeline:~/ad-creator-fs-az/public/sku/

rsync -avL --progress -e "ssh -i scripts/pipeline/keys/wallets-lambda-mac.pem"  lambda_pipeline:~/ad-creator-fs-az/public/renders/ public/renders/

rsync -avL --progress -e "ssh -i scripts/pipeline/keys/wallets-lambda-mac.pem"  129.146.105.241:~/ad-creator-fs-az/public/sku/renders/ public/sku/renders/



scp -i scripts/pipeline/keys/wallets-lambda-mac.pem  scripts/pipeline/blender_files/pouch_product.v1.blend lambda_pipeline:~/blender_files/.

blender --background pouch_product.v1.blend --python ad-create-render.py

blender --background pouch_product.v1.blend --python ad-create-render.py


blender --background pouch_product.fh.captabs.v1.blend --python ad-create-render.fh.py

blender --background pouch_product.fh.captabs.v1.blend --python ad-create-render.fh.py


blender --background pouch_product.fh.powder.v2.blend --python ad-create-render.fh.powder.py
blender --background pouch_product.fh.capsules.v2.blend --python ad-create-render.fh.capsules.py
blender --background pouch_product.fh.tablets.v2.blend --python ad-create-render.fh.tablets.py
blender --background pouch_product.fh.softgels.v2.blend --python ad-create-render.fh.softgels.py

S_BERB-CP_500MG
