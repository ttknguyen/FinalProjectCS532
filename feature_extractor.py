# import necessary libraries
from cirtorch.networks.imageretrievalnet import init_network
from cirtorch.networks.imageretrievalnet import extract_vectors
from cirtorch.networks.imageretrievalnet import extract_ss, extract_ms
from cirtorch.utils.general import get_data_root
from torch.utils.model_zoo import load_url
from torchvision import transforms
from tqdm import tqdm
import tensorflow as tf
#import tensorflow_hub as hub

from Module.cnnImageRetrievalPytorch import Searching, load_network
from Module.resnet_image_retrieval import load_model, feature_extraction_resnet
from numpy.linalg import norm
from numpy import dot
import numpy as np
import os, glob2
import cv2 as cv
import argparse 

def load_corpus(path):
    print("Loading Corpus ...")

    os.chdir(path)
    list_image = glob2.glob('*.jpg')
    
    print(">>> Sucess...")
    print('__________________________')   
    return list_image
  
def feature_extraction_method_0(corpus, save_path = "", root = "", data_path = ''):
    model = load_model()

    os.chdir(save_path)
    if (os.path.isdir('feature_extraction_method_0') == False):
        os.mkdir('feature_extraction_method_0')
        #os.chdir(save_path + 'feature_extraction_method_0/')
        print("Create feature_extraction_method_0 ...")
        print("Extracting:")

    else:
        print("Method 0 is extracted ...")
        return
    os.chdir(root)
    
    with tqdm(total=len(corpus)) as pbar:
        for img in corpus:
            # Feature extraction
            image = cv.imread(root + data_path + img)
            feature = feature_extraction_resnet(model, image)
            np.save(save_path + 'feature_extraction_method_0/' + img[:-3] + 'npy', feature)
            del image
            pbar.update(1)
    del model
    print(">> Sucess ...")
    print('__________________________')
    return

def feature_extraction_method_1(corpus, save_path = "", root = ""):
    os.chdir(save_path)
    if (os.path.isdir('feature_extraction_method_1') == False):
        os.mkdir('feature_extraction_method_1')
        os.chdir(save_path + 'feature_extraction_method_1/')
        print("Create feature_extraction_method_1 ...")
        print("Extracting:")

    else:
        print("Method 1 is extracted ...")
        return

    net, transform, ms = load_network()
    net.cuda()
    net.eval()

    with tqdm(total=len(corpus)) as pbar:
        for img in corpus:
            # Feature extraction
            feature = extract_vectors(net, [root + img], 1024, transform, ms=ms)
            feature = feature.numpy()
            np.save(img[:-3] + 'npy', feature)
            del feature
            pbar.update(1)
    
    del net, transform, ms
    print(">> Sucess ...")
    print('__________________________')
    return


parser = argparse.ArgumentParser(description='Feature Extraction End2End')

parser.add_argument('--root', '-r', metavar='ROOT', default = 'd:/University/CS532.M21.KHCL/FinalProjectCS532/', help='root')
parser.add_argument('--data_path', '-path_corpus', metavar='PATHCORPUS', default = 'data/dataset/', help='path to dataset')
parser.add_argument('--features_path', '-save_path', metavar='SAVEPATH', default = 'data/', help='path to save features')
parser.add_argument('--method', '-m', metavar='METHOD', default = '0', help='method to extract feature')
def main():
    args = parser.parse_args()
    corpus = load_corpus(args.data_path)

    if (args.method == '0'):
      feature_extraction_method_0(corpus,args.root + args.features_path, args.root, args.data_path)
    elif (args.method == '1'):
      feature_extraction_method_1(corpus,args.root + args.features_path, args.data_path)

if __name__ == '__main__':
    main()