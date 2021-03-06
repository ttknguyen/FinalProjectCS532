#import cac thu vien can thiet
from cirtorch.networks.imageretrievalnet import init_network
from cirtorch.networks.imageretrievalnet import extract_vectors
from cirtorch.networks.imageretrievalnet import extract_ss, extract_ms
from cirtorch.utils.general import get_data_root
from torch.utils.model_zoo import load_url
from torchvision import transforms
from tqdm import tqdm
#import tensorflow_hub as hub

from Module.cnnImageRetrievalPytorch import Searching, load_network
from Module.resnet_image_retrieval import load_model, feature_extraction_resnet, retrieval_resnet
import numpy as np
import cv2 as cv
import os, glob2
import tensorflow as tf

def load_corpus(path):
    print("Loading Corpus ...")

    os.chdir(path)
    list_image = glob2.glob('*.jpg')
    
    print(">>> Sucess...")
    print('__________________________\n')   
    return list_image

def load_features(path, corpus):
    feature_method_0 = {}
    print("Loading Feature method 0...")
    with tqdm(total=len(corpus)) as pbar:
        for img in corpus:
            feature_method_0[img] = np.load(path + 'feature_extraction_method_0/' +img[:-3] + 'npy')
            pbar.update(1)
    print(">>> Sucess...")
    print('__________________________\n')

    feature_method_1 = {}
    print("Loading Feature method 1...")
    with tqdm(total=len(corpus)) as pbar:
        for img in corpus:
            feature_method_1[img] = np.load(path + 'feature_extraction_method_1/' +img[:-3] + 'npy')
            pbar.update(1)
    print(">>> Sucess...")
    print('__________________________\n')
    
    return feature_method_0, feature_method_1

def load_methods(root):
    os.chdir(root)
    #Method 0
    model = load_model()
    return model

def method_1(query_path, bbx, feature_corpus):
    net, transform, ms = load_network()
    net.cuda()
    net.eval()

    feature_query = extract_vectors(net, [query_path], 1024, transform, bbxs= [bbx], ms=ms)
    results = Searching(feature_query, feature_corpus, 20)
    final_results = [i[0] for i in results]
    
    return final_results

def method_0(query_path, bbx, feature_corpus, model):
    image = cv.imread(query_path)
    image = image[bbx[1]:bbx[3], bbx[0]:bbx[2]]
    
    feature_query = feature_extraction_resnet(model, image)
    results = retrieval_resnet(feature_query, feature_corpus, 20)
    final_results = [i[0] for i in results]
    return final_results


def main():
    print("Enter Corpus path:", end = " ")  
    path_corpus = '/content/CS336.M11.KHCL/data/test/oxford5k/jpg/' #input()
    corpus = load_corpus(path_corpus)    

    # Load Corpus's feature extracted
    print("Enter Feature path:", end = " ")
    
    path = '/content/CS336.M11.KHCL/data/'  #input()
    fe_method0, fe_method1 = load_features(path, corpus)

    print("Enter root:", end = " ")
    root = '/content/CS336.M11.KHCL/' #input()
    model, delf = load_methods(root)

    key = 1
    while(key != 0):
        print("Enter Query Image's path:", end = " ")
        query_path = input()

        print("Enter bbx of intance:", end = " ")
        x1, y1, x2, y2 = [int(i) for i in input().split(',')]
        bbx = (x1, y1, x2, y2)

        print("Choose methods (0-2):")
        id_method = input()

        if (id_method == '0'):
          results = method_0(query_path, [x1, y1, x2, y2], fe_method0, model)
        
        elif (id_method == '1'):
          results = method_1(query_path, bbx, fe_method1)

        #Extract Query
        #feature_query = extract_vectors(net, [query_path], 1024, transform, bbxs= [(x1, y1, x2, y2)], ms=ms)
        #results = Searching(feature_query, feature_corpus, top = 10)
        print("Results top 10:")
        print(results)
        print("...............................................")
        print("Continue retrieval ? (Enter 0 to exit)")
        key = int(input())



if __name__ == '__main__':
    main()