---
layout: post
title: "SPM Toolbox Guidance"
date: 2019-12-17T12:20:00Z
---

* TOC 
{:toc}
---

## 1.0 Data Files 

The EEG data from Thomas' paper 

* https://drive.google.com/drive/folders/1UJUQZXb7Sjazs-u_quPGZZcUTfi_iFD3?usp=sharing 

In `spm_EEG`, there are two files for each participants. For example, the corresponding files of participant 201 are `MS201.dat` and `MS201.mat` separately.  The `MS201.dat` contains real EEG data while `MS201.mat` has the other information.  



Note that all data is processed by the Matlab SPM toolbox. Please install it before playing with the EEG data. 



I wrote a Matlab script which can perform the **filtering operation**. Epoching and Laplacian referencing is still in progress. Please download from the following link. 

* <https://github.com/randoruf/tLab-summer-intern-sleep-EEG-emachine-2019-2020/tree/master/pre-processing>

---



### 1.1 Installing SPM12 

About how to install, 

* For Windows user,  <https://en.wikibooks.org/wiki/SPM/Installation_on_Windows#SPM12> 

* For Linux user, <https://en.wikibooks.org/wiki/SPM/Installation_on_64bit_Linux>

* For MacOS user, <https://en.wikibooks.org/wiki/SPM/Installation_on_64bit_Mac_OS_(Intel)>



To add SPM12 to Matlab as a library,  

- Go to `HOME` tab
- Open `Set Path` prompt 
- Click on `Add with subfolders` and select SPM12 folder. 



**SPM12** has a comprehensive documentation, please refer to https://www.fil.ion.ucl.ac.uk/spm/doc/. But some useful usages are mentioned below. 

---

### 1.2 Load EEG data 

You can load the EEG data of a participant by  the command `spm_eeg_load()` function. 

 For example, if you want to load participant 201 into Matlab workspace, 

```matlab
D = spm_eeg_load('SSP/spm_EEG/MS201.mat'); 
```

D is a SPM M/EEG object, which has `channels` , `sampling rate`, `samples` fields. 

![image-20191217132941738](/shared/imgs/image-20191217132941738.png)

The first dimension(26) descripts the potential collected from all channels/electrodes.  



### 1.3 Plotting EEG  

***All electrodes are referenced to the average mastoid***. (without any re-referencing such as bipolar referencing or Laplacian referencing). 

Please re-reference the EEG before use it. 

<img src="/shared/imgs/800px-21_electrodes_of_International_10-20_system_for_EEG.svg.png" alt="800px-21_electrodes_of_International_10-20_system_for_EEG.svg" style="zoom: 33%;" />



If you want to plot the potential of 'Cz', write a matlab function like this 

```matlab
function i = find_channel_index(c)
t = {'EOG left','EOG right','Fp1','C3','O1','Fp2','C4','O2','T3','T4','F3','F4','P3','P4','F7','F8','T5','T6','Fz','Cz','Pz','ECG','EMG chin','EMG right','EMG left','DIN'};
i = match_str(t,c); 
end 
```

This matlab function will return the index of electrode/channel given the name of electrode. 

```matlab
plot(1:D.nsamples, D(find_channel_index('Cz'), :, 1))
```

* `D(find_channel_index('Cz'), :, 1)` has potential of electrode Cz in a night.  
* `1:D.nsamples` is a vector that to fit with potential from D. 



### 1.4 Filtering EEG 

EEG usually has DC offset (less than 0.5 Hz) high frequency noises (greater than 40Hz, such as line noises). 

Use `spm_eeg_filter` function, it has 

* High pass filter 
* Low pass filter 
* Notch (band-stop) filter 
* Band-pass filter 

An example (remove all high frequency noises )

```matlab
% then low-pass filtered <40 Hz (two-pass Butterworth filters at the fifth order).
S = []; 
S.D = D; 
S.type = 'butterworth'; S.order = 5; S.dir = 'twopass'; 
S.band = 'low';
S.freq = [40];
D = spm_eeg_filter(S);
```

By executing these command, a new file `fMS201.mat` is generated. 

You can use the `fft` in Matlab to verify the performance of the filter. 

```matlab
Fs = 200;                % Sampling frequency                    
T = 1/Fs;                % Sampling period       
L = D.nsamples           % Length of signal

y = D(find_channel_index('Cz'),:,1);

%% Compute the FFT of the signal 
Y = fft(y);     % to frequency domain 
% Note that FFT is two-sided spectrum
% But two sides are symmetry... 

%% 
% Compute the two-sided spectrum P2. 
% Then compute the single-sided spectrum P1 based on P2 and the even-valued signal length L.
P2 = abs(Y/L);
P1 = P2(1:L/2+1);
P1(2:end-1) = 2*P1(2:end-1);

%% 
f = Fs*(0:(L/2))/L;
plot(f,P1) 
title('Single-Sided Amplitude Spectrum of X(t)')
xlabel('f (Hz)')
ylabel('|P1(f)|')
```



### 1.5 Reading Sleep Scoring data 

To load the sleep scoring data,

```matlab
S = load(['SSP/sleep_scoring/sleepScoring3_S201.mat']);
```

Similar trick if you want to plot the hypnogram 

```matlab
plot(1:length(S.hypnogram), S.hypnogram)
```





