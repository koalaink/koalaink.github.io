/**
 * Diff Match —— Longest Common Subsequence
 */
var DiffMatch = (function(){

  var DIFF_EQUAL = 0;
  var DIFF_DELETE = -1;
  var DIFF_INSERT = 1;

  var DIFF_PATH_DIAGONA = '↖︎';
  var DIFF_PATH_VERTICAL = '↑';
  var DIFF_PATH_HORIZONTAL = '←';

  function DiffMatch(){
    this.text1 = '';
    this.text2 = '';

    this.dp = [];
    this.path = [];
  }

  /**
   * 找出两个文本的差异 以数组返回
   * 返回数组结构： [[DIFF_type, string], ...]
   * @param  {string}   text1  old string
   * @param  {string}   text2  new string
   * @return {array}    array of diffs
   * @author DHB(daihuibin@weidian.com)
   */
  DiffMatch.prototype.diff = function(text1, text2, line_based){
    // 开始时间
    var st = new Date().getTime();

    if(line_based){
      text1 = text1.split('\n');
      text2 = text2.split('\n');

      text1.forEach(function(text, index) {
        text1[index] = text + '\n';
      });

      text2.forEach(function(text, index) {
        text2[index] = text + '\n';
      });
    }

    var len1 = text1.length;
    var len2 = text2.length;

    this.init(text1, text2);

    // 空间优化
    var k = 1;
    var k_subtract_one = 0;

    for(var i = 1; i <= len1; (++i, k_subtract_one = k, k = Number(!k))){
      for(var j = 1; j <= len2; ++j){
        if(text1[i - 1] === text2[j - 1]){
          this.dp[k][j] = this.dp[k_subtract_one][j - 1] + 1;
          this.path[i][j] = DIFF_PATH_DIAGONA;
        } else if(this.dp[k_subtract_one][j] > this.dp[k][j - 1]){
          this.dp[k][j] = this.dp[k_subtract_one][j];
          this.path[i][j] = DIFF_PATH_VERTICAL;
        } else {
          this.dp[k][j] = this.dp[k][j - 1];
          this.path[i][j] = DIFF_PATH_HORIZONTAL;
        }
      }
    }

    this.diffs = this.getDiffsFromPath();

    var et = new Date().getTime();
    this.timeConsumed = et - st;
    return this.diffs;
  };

  /**
   * 数据初始化
   * @param  {string}   text1 old string
   * @param  {string}   text2 new string
   * @return {null}   null
   * @author DHB(daihuibin@weidian.com)
   */
  DiffMatch.prototype.init = function(text1, text2){
    this.text1 = text1;
    this.text2 = text2;

    var len1 = text1.length;
    var len2 = text2.length;

    // 空间优化 2*len2
    this.dp = [];
    for(var i = 0; i < 2; ++i){
      this.dp.push([]);
      for(var j = 0; j <= len2; ++j){
        this.dp[i].push(0);
      }
    }

    this.path = [];
    for(var i = 0; i <= len1; ++i){
      this.path.push([]);
      for(var j = 0; j <= len2; ++j){
        this.path[i].push(0);
      }
    }
  };

  /**
   * 从path中读出最长公共子序列
   * @return {string}   Longest common Subsequence
   * @author DHB(daihuibin@weidian.com)
   */
  DiffMatch.prototype.getLCS = function(){
    var lcs = '';
    var path = this.path;
    var text = this.text1;

    function path_lcs(i, j){
      if(i === 0 || j === 0){
        return;
      }
      if(path[i][j] === DIFF_PATH_DIAGONA){
        path_lcs(i - 1, j - 1);
        lcs += text[i-1];
      } else if(path[i][j] === DIFF_PATH_VERTICAL){
        path_lcs(i - 1, j);
      } else if(path[i][j] === DIFF_PATH_HORIZONTAL){
        path_lcs(i, j - 1);
      }
    }

    path_lcs(this.text1.length, this.text2.length);

    return lcs;
  };

  /**
   * 从path中获取diffs
   * @return {array}   差异数组
   * @author DHB(daihuibin@weidian.com)
   */
  DiffMatch.prototype.getDiffsFromPath = function(){
    var diffs = [];

    var path = this.path;
    var text1 = this.text1;
    var text2 = this.text2;

    function path_diffs(i, j){
      if(i === 0 || j === 0){
        if(i !== 0){
          if(typeof text1 === 'string'){
            diffs.push([DIFF_DELETE, text1.substring(0, i)]);
          } else {
            diffs.push([DIFF_DELETE, text1.splice(0, i).join('')]);
          }
        }
        if(j !== 0){
          if(typeof text2 === 'string'){
            diffs.push([DIFF_INSERT, text2.substring(0, j)]);
          } else {
            diffs.push([DIFF_INSERT, text2.splice(0, j).join('')]);
          }
        }
        return;
      }
      if(path[i][j] === DIFF_PATH_DIAGONA){
        path_diffs(i - 1, j - 1);
        diffs.push([DIFF_EQUAL, text1[i - 1]]);
      } else if(path[i][j] === DIFF_PATH_VERTICAL){
        path_diffs(i - 1, j);
        diffs.push([DIFF_DELETE, text1[i - 1]]);
      } else if(path[i][j] === DIFF_PATH_HORIZONTAL){
        path_diffs(i, j - 1);
        diffs.push([DIFF_INSERT, text2[j - 1]]);
      }
    }

    path_diffs(text1.length, text2.length);

    return this.mergeDiffs(diffs);
  };

  /**
   * 合并diffs中的连续相同编辑
   * @param  {array}   df 差异数组
   * @return {array}      合并后的差异数组
   * @author DHB(daihuibin@weidian.com)
   */
  DiffMatch.prototype.mergeDiffs = function(df){
    if(!df || !df.length){
      return [];
    }
    var diffs = [];
    var lst_op = df[0][0];
    var lst_st = df[0][1];

    for(var i = 1; i < df.length; ++i){
      while(i < df.length && df[i][0] === lst_op){
        lst_st += df[i++][1];
      }
      diffs.push([lst_op, lst_st]);
      lst_st = '';
      if(i >= df.length){
        break;
      }
      lst_op = df[i][0];
      lst_st = df[i][1];
    }
    if(lst_st){
      diffs.push([lst_op, lst_st]);
    }
    return diffs;
  };

  /**
   * 获取用以展示的差异html代码
   * @return {string}   html代码
   * @author DHB(daihuibin@weidian.com)
   */
  DiffMatch.prototype.prettyHtml = function(){
    var diffs = this.diffs;
    var html = [];
    var pattern_amp = /&/g;
    var pattern_lt = /</g;
    var pattern_gt = />/g;
    var pattern_para = /\n/g;
    var pattern_blank = / /g;
    var pattern_tab = /\t/g;
    for (var x = 0; x < diffs.length; x++) {
      var op = diffs[x][0];    // Operation (insert, devare, equal)
      var data = diffs[x][1];  // Text of change.
      var text = data.replace(pattern_amp, '&amp;').replace(pattern_lt, '&lt;')
            .replace(pattern_gt, '&gt;')
            .replace(pattern_para, '&para;<br>')
            .replace(pattern_blank, '&nbsp;')
            .replace(pattern_tab, '&nbsp;&nbsp;');
      switch (op) {
        case DIFF_INSERT:
          html[x] = '<ins style="background:#e6ffe6;">' + text + '</ins>';
          break;
        case DIFF_DELETE:
          html[x] = '<del style="background:#ffe6e6;">' + text + '</del>';
          break;
        case DIFF_EQUAL:
          html[x] = '<span>' + text + '</span>';
          break;
      }
    }
    return html.join('');
  }

  /**
   * 查找路径图
   * @param  {string}   text1 old string
   * @param  {string}   text2 new string
   * @return {string}   html code of path
   * @author DHB(daihuibin@weidian.com)
   */
  DiffMatch.prototype.pathHtml = function(mark_path){
    var path = this.path;
    var len1 = this.text1.length;
    var len2 = this.text2.length;

    var paths = [];
    if(mark_path){
      var text = this.text1;

      function path_lcs(i, j){
        if(i === 0 || j === 0){
          return;
        }
        paths.push(i + '_' + j);
        if(path[i][j] === DIFF_PATH_DIAGONA){
          path_lcs(i - 1, j - 1);
        } else if(path[i][j] === DIFF_PATH_VERTICAL){
          path_lcs(i - 1, j);
        } else if(path[i][j] === DIFF_PATH_HORIZONTAL){
          path_lcs(i, j - 1);
        }
      }
      path_lcs(this.text1.length, this.text2.length);

    }

    var text = '<table><tr><td>&nbsp;</td>';
    for(var i = 0; i < len2; ++i){
      text += '<td>' + (this.text2[i] !== '\n' ? this.text2[i] : '\\n') + '</td>';
    }
    text += '</tr>';
    for(var i = 1; i <= len1; ++i){
      text += '<tr><td>' + (this.text1[i-1] !== '\n' ? this.text1[i-1] : '\\n') + '</td>';
      for(var j = 1; j <= len2; ++j){
        text += '<td' + (mark_path && paths.indexOf(i+'_'+j) !== -1 ? ' style="color: red;"' : '') + '>' + path[i][j] + '</td>';
      }
      text += '</tr>';
    }
    text += '</table>'
    return text;
  };

  return DiffMatch;
})();

window.DiffMatch = DiffMatch;
// module.exports = DiffMatch;
