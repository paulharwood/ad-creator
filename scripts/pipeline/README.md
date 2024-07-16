# Howto

vi ~/.ssh/config


Host lambda_pipeline
     Hostname 0.0.0.0
     User ubuntu
     Port 22



scp -i scripts/pipeline/keys/wallets-lambda-mac.pem -r scripts/pipeline/blender_files/ lambda_pipeline:~/.
scp -i scripts/pipeline/keys/wallets-lambda-mac.pem -r public/sku/data/selected_products.fh.csv lambda_pipeline:~/blender_files/.

rsync -avL --progress -e "ssh -i scripts/pipeline/keys/wallets-lambda-mac.pem"  public/sku/ lambda_pipeline:~/ad-creator-fs-az/public/sku/
ssh -i scripts/pipeline/keys/wallets-lambda-mac.pem lambda_pipeline
cd blender_files
./setup.sh


cd {root directory}

rsync -avL --progress -e "ssh -i scripts/pipeline/keys/wallets-lambda-mac.pem"  public/sku/ lambda_pipeline:~/ad-creator-fs-az/public/sku/

rsync -avL --progress -e "ssh -i scripts/pipeline/keys/wallets-lambda-mac.pem"  lambda_pipeline:~/ad-creator-fs-az/public/renders/ public/renders/

rsync -avL --progress -e "ssh -i scripts/pipeline/keys/wallets-lambda-mac.pem"  129.146.105.241:~/ad-creator-fs-az/public/sku/renders/ public/sku/renders/



scp -i scripts/pipeline/keys/wallets-lambda-mac.pem  scripts/pipeline/blender_files/pouch_product.v1.blend lambda_pipeline:~/blender_files/.

blender --background pouch_product.v1.blend --python ad-create-render.py

blender --background pouch_product.v1.blend --python ad-create-render.py


blender --background pouch_product.fh.captabs.v1.blend --python ad-create-render.fh.py

