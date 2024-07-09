# Howto

scp -i keys/wallets-lambda-mac.pem -r blender_files/ ubuntu@129.146.54.243:~/.

ssh -i keys/wallets-lambda-mac.pem ubuntu@129.146.54.243

cd {root directory}

rsync -avL --progress -e "ssh -i ../scripts/pipeline/keys/wallets-lambda-mac.pem"  public/sku/ ubuntu@129.146.54.243:~/ad-creator-fs-az/public/sku/

rsync -avL --progress -e "ssh -i scripts/pipeline/keys/wallets-lambda-mac.pem"  ubuntu@129.146.54.243:~/ad-creator-fs-az/public/sku/renders/ public/sku/renders/

rsync -avL --progress -e "ssh -i scripts/pipeline/keys/wallets-lambda-mac.pem"  ubuntu@129.146.105.241:~/ad-creator-fs-az/public/sku/renders/ public/sku/renders/



scp -i scripts/pipeline/keys/wallets-lambda-mac.pem  scripts/pipeline/blender_files/pouch_product.v1.blend ubuntu@129.146.54.243:~/blender_files/.

blender --background pouch_product.v1.blend --python ad-create-render.py

