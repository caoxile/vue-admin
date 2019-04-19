<template>
  <div class="app-container">
    <el-table :stripe="true" :data="list" v-loading.body="listLoading" element-loading-text="拼命加载中" border fit
              highlight-current-row>
      <el-table-column align="center" label="序号" width="80">
        <template slot-scope="scope">
          <span v-text="getIndex(scope.$index)"> </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户名" prop="username" ></el-table-column>
      <el-table-column align="center" label="昵称" prop="nickname" ></el-table-column>
      <el-table-column align="center" label="登录时间" >
        <template slot-scope="scope">
          {{parseTime(scope.row.startTimestamp)}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="最后访问时间" >
        <template slot-scope="scope">
          {{parseTime(scope.row.lastAccessTime)}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="IP" prop="host" ></el-table-column>
      <el-table-column align="center" label="状态" >
        <template slot-scope="scope">
          {{scope.row.status=='1'?'在线':'离线'}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="220" v-if="hasPerm('system:session-kickout')">
        <template slot-scope="scope">
          <el-button type="warning" size="mini" icon="plus" v-if="hasPerm('system:session-kickout')" @click="kickout">下线</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="listQuery.pageNum"
      :page-size="listQuery.pageSize"
      :total="totalCount"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
  </div>
</template>
<script>
  import {mapGetters} from 'vuex'

  export default {
    data() {
      return {
        totalCount: 0, //分页组件--数据总条数
        list: [],//表格的数据
        listLoading: false,//数据加载等待动画
        listQuery: {
          pageNum: 1,//页码
          pageSize: 10,//每页条数
        },
      }
    },
    created() {
      this.getList();
    },
    computed: {
    },
    methods: {
      getList() {
        //查询列表
        this.listLoading = true;
        this.api({
          url: "/system/session/list",
          method: "post",
        }).then(data => {
          this.listLoading = false;
          this.list = data;
          this.totalCount = data.length;
        })
      },
      handleSizeChange(val) {
        //改变每页数量
        this.listQuery.pageSize = val
        this.handleFilter();
      },
      handleCurrentChange(val) {
        //改变页码
        this.listQuery.pageNum = val
        this.getList();
      },
      handleFilter() {
        //查询事件
        this.listQuery.pageNum = 1
        this.getList()
      },
      getIndex($index) {
        //表格序号
        return (this.listQuery.pageNum - 1) * this.listQuery.pageSize + $index + 1
      },
      //下线
      kickout(id){
        this.$confirm('确定下线?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.api({
            url: "/system/session/kickout",
            method: "post",
            params:{sessionId:id}
          }).then(data => {
            this.$message({
              message: '下线成功',
              type: 'success'
            });
          })
        })
      },
    }
  }
</script>
